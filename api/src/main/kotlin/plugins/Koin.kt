package xyz.aniways.plugins

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import kotlinx.serialization.json.Json
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger
import xyz.aniways.database.AniwaysDB
import xyz.aniways.database.AniwaysDBImpl
import xyz.aniways.env
import xyz.aniways.features.auth.di.authModule
import xyz.aniways.features.settings.di.settingsModule

fun Application.configureKoin() {
    /*
    * Ensure that the database module is created at the start of the application
    * to avoid any issues with the database connection + migrations
    * */
    val dbModule = module(createdAtStart = true) {
        single<AniwaysDB> {
            AniwaysDBImpl(config = env.dbConfig)
        }
    }

    val httpModule = module() {
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
    }

    install(Koin) {
        slf4jLogger()
        modules(dbModule, httpModule, authModule, settingsModule)
    }
}