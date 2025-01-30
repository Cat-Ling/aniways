package xyz.aniways

import io.ktor.server.application.*
import io.ktor.server.netty.*
import xyz.aniways.plugins.*

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    configureKoin()
    configureSerialization()
    configureMonitoring()
    configureRateLimiting()
    configureSession()
    configureAuth()
    configureRouting()
}
