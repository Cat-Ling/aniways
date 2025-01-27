package xyz.aniways

import io.ktor.server.application.*
import io.ktor.server.netty.*
import xyz.aniways.plugins.configureMonitoring
import xyz.aniways.plugins.configureRateLimiting
import xyz.aniways.plugins.configureRouting
import xyz.aniways.plugins.configureSerialization

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    configureSerialization()
    configureMonitoring()
    configureRateLimiting()
    configureRouting()
}
