package xyz.aniways.database

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.flywaydb.core.Flyway
import org.flywaydb.core.api.FlywayException
import org.ktorm.database.Database
import org.ktorm.database.Transaction
import org.ktorm.logging.Slf4jLoggerAdapter
import org.slf4j.LoggerFactory
import xyz.aniways.Env
import javax.sql.DataSource
import kotlin.coroutines.CoroutineContext

interface AniwaysDatabase {
    suspend fun <T> query(block: suspend Database.(Transaction) -> T): T
}

class AniwaysDatabaseImpl(
    private val config: Env.DBConfig,
    private val dispatcher: CoroutineContext = Dispatchers.IO,
) : AniwaysDatabase {
    private val logger = LoggerFactory.getLogger("AniwaysDatabase")
    init {
        logger.info("Initializing AniwaysDatabase with DB url: ${config.url}")
    }

    private val db = migrateAndConnect { dataSource ->
        Database.connect(
            dataSource = dataSource,
            logger = Slf4jLoggerAdapter(loggerName = "AniwaysDatabase")
        )
    }

    private fun migrateAndConnect(connectDb: (DataSource) -> Database): Database {
        val dataSource = hikariDatasource()

        return try {
            val flyway = Flyway.configure()
                .connectRetries(10)
                .connectRetriesInterval(10_000)
                .validateMigrationNaming(true)
                .dataSource(dataSource)
                .load()

            flyway.migrate()

            connectDb(dataSource)
        } catch (e: FlywayException) {
            dataSource.close()
            throw e
        }
    }

    private fun hikariDatasource(): HikariDataSource {
        val config = HikariConfig().apply {
            driverClassName = "org.postgresql.Driver"
            jdbcUrl = config.url
            username = config.user
            password = config.password
            maximumPoolSize = 10
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            addDataSourceProperty("ssl.mode", "disable")
            connectionTestQuery = "SELECT 1"
            connectionTimeout = 10000 // 10 seconds
            idleTimeout = 60000 // 1 minute
            maxLifetime = 1800000 // 30 minutes
            validate()
        }

        var lastError: Exception? = null
        repeat(5) { attempt ->
            try {
                logger.info("🔄 Attempting to connect to DB (try ${attempt + 1}/5)...")
                return HikariDataSource(config)
            } catch (e: Exception) {
                lastError = e
                logger.error("❌ Failed to connect to DB (try ${attempt + 1}/5)", e)
                Thread.sleep(3_000) // wait 3 seconds before retry
            }
        }

        logger.error("❌ Failed to connect to DB after 5 attempts", lastError)
        throw lastError ?: Exception("Unknown error occurred while connecting to the database")
    }

    override suspend fun <T> query(
        block: suspend Database.(Transaction) -> T
    ) = withContext(dispatcher) {
        db.useTransaction { t -> db.block(t) }
    }
}