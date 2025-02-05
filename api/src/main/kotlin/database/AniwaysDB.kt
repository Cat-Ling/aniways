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
import xyz.aniways.DBConfig
import javax.sql.DataSource
import kotlin.coroutines.CoroutineContext

interface AniwaysDB {
    suspend fun <T> query(block: suspend Database.(Transaction) -> T): T
}

class AniwaysDBImpl(
    private val config: DBConfig,
    private val dispatcher: CoroutineContext = Dispatchers.IO,
) : AniwaysDB {
    private val db = migrateAndConnect { dataSource ->
        Database.connect(
            dataSource = dataSource,
            logger = Slf4jLoggerAdapter(loggerName = "AniwaysDB")
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

            connectDb(hikariDatasource())
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
            maximumPoolSize = 3
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            addDataSourceProperty("ssl.mode", "disable")
            validate()
        }

        return HikariDataSource(config)
    }

    override suspend fun <T> query(
        block: suspend Database.(Transaction) -> T
    ) = withContext(dispatcher) {
        db.useTransaction { t -> db.block(t) }
    }
}