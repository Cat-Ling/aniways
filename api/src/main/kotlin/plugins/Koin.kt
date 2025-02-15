package xyz.aniways.plugins

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import kotlinx.serialization.json.Json
import org.koin.core.logger.Level
import org.koin.core.module.dsl.createdAtStart
import org.koin.core.module.dsl.withOptions
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger
import xyz.aniways.Env
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.database.AniwaysDatabaseImpl
import xyz.aniways.env
import xyz.aniways.features.anime.animeModule
import xyz.aniways.features.auth.authModule
import xyz.aniways.features.settings.settingsModule

fun Application.configureKoin() {
    val envModule = module {
        single { env }

        single {
            val env: Env = get()
            env.serverConfig
        }

        single {
            val env: Env = get()
            env.dbConfig
        }

        single {
            val env: Env = get()
            env.malCredentials
        }

        single {
            val env: Env = get()
            env.redisConfig
        }
    }

    /*
    * Ensure that the database module is created at the start of the application
    * to avoid any issues with the database connection + migrations
    * */
    val dbModule = module {
        single {
            AniwaysDatabaseImpl(get()) as AniwaysDatabase
        } withOptions {
            createdAtStart()
        }
    }

    val mainModule = module {
        single {
            HttpClient(CIO) {
                expectSuccess = true

                install(Logging) {
                    logger = Logger.DEFAULT
                    level = LogLevel.INFO
                }

                install(ContentNegotiation) {
                    json(Json {
                        ignoreUnknownKeys = true
                        prettyPrint = true
                        explicitNulls = false
                    })
                }
            }
        }
    }

    install(Koin) {
        slf4jLogger(Level.DEBUG)

        modules(
            envModule,
            dbModule,
            mainModule,
            authModule,
            animeModule,
            settingsModule
        )
    }
}