package xyz.aniways.plugins

import io.ktor.server.application.*
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger
import xyz.aniways.di.mainModule

fun Application.configureKoin() {
    install(Koin) {
        slf4jLogger()
        modules(mainModule)
    }
}