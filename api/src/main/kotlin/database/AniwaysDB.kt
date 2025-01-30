package xyz.aniways.database

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.ktorm.database.Database
import org.ktorm.database.Transaction
import org.ktorm.logging.Slf4jLoggerAdapter
import xyz.aniways.DBConfig
import kotlin.coroutines.CoroutineContext

interface AniwaysDB {
    suspend fun <T> query(block: suspend Database.(Transaction) -> T): T
}

class AniwaysDBImpl(
    private val config: DBConfig,
    private val dispatcher: CoroutineContext = Dispatchers.IO,
) : AniwaysDB {
    private val db = Database.connect(
        dataSource = hikariDatasource(),
        logger = Slf4jLoggerAdapter(loggerName = "KtormDB")
    )

    private fun hikariDatasource(): HikariDataSource {
        val config = HikariConfig().apply {
            driverClassName = "org.postgresql.Driver"
            jdbcUrl = config.url
            username = config.user
            password = config.password
            maximumPoolSize = 3
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
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