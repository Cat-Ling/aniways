package xyz.aniways

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import xyz.aniways.application.plugins.configureMonitoring
import xyz.aniways.application.plugins.configureRouting
import xyz.aniways.application.plugins.configureSerialization

fun main() {
    try {
        println("Starting application initialization")

        embeddedServer(
            Netty,
            port = 8080,
            host = "0.0.0.0",
            module = { module() }
        ).apply {
            println("Server configured, starting...")
            start(wait = true)
        }
    } catch (e: Exception) {
        println("Critical error starting server: ${e.message}")
        e.printStackTrace()
        throw e
    }
}

fun Application.module() {
    configureMonitoring()
    configureSerialization()
    configureRouting()
}
