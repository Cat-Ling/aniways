package xyz.aniways.plugins

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.server.application.*
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger
import org.ktorm.database.Database
import org.ktorm.logging.Slf4jLoggerAdapter
import xyz.aniways.env
import xyz.aniways.features.user.di.userModule

fun Application.configureKoin() {
    val mainModule = module {
        single { HttpClient(CIO) }
        single {
            val config = HikariConfig().apply {
                driverClassName = "org.postgresql.Driver"
                jdbcUrl = env.dbUrl
                username = env.dbUser
                password = env.dbPassword
                maximumPoolSize = 3
                transactionIsolation = "TRANSACTION_REPEATABLE_READ"
                validate()
            }

            Database.connect(
                HikariDataSource(config),
                logger = Slf4jLoggerAdapter(loggerName = "KtormDB")
            )

        }
    }

    install(Koin) {
        slf4jLogger()
        modules(mainModule, userModule)
    }
}