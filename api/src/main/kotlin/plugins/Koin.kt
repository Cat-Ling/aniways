package xyz.aniways.plugins

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import kotlinx.serialization.json.Json
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger
import org.ktorm.database.Database
import org.ktorm.logging.Slf4jLoggerAdapter
import xyz.aniways.env
import xyz.aniways.features.auth.di.authModule
import xyz.aniways.features.user.di.userModule
import xyz.aniways.utils.TransactionService

fun Application.configureKoin() {
    val mainModule = module {
        single {
            HttpClient(CIO) {
                install(Logging) {
                    logger = Logger.DEFAULT
                    level = LogLevel.ALL
                }

                install(ContentNegotiation) {
                    json(Json {
                        ignoreUnknownKeys = true
                        prettyPrint = true
                    })
                }
            }
        }

        single {
            val config = HikariConfig().apply {
                driverClassName = "org.postgresql.Driver"
                jdbcUrl = env.dbConfig.url
                username = env.dbConfig.user
                password = env.dbConfig.password
                maximumPoolSize = 3
                transactionIsolation = "TRANSACTION_REPEATABLE_READ"
                validate()
            }

            Database.connect(
                HikariDataSource(config),
                logger = Slf4jLoggerAdapter(loggerName = "KtormDB")
            )
        }
        factory { TransactionService(get()) }
    }

    install(Koin) {
        slf4jLogger()
        modules(mainModule, authModule, userModule)
    }
}