package xyz.aniways.plugins

import io.ktor.server.application.*
import io.ktor.server.resources.*
import io.ktor.server.routing.*
import xyz.aniways.features.auth.routes.authRoutes

fun Application.configureRouting() {
    install(Resources)
    routing {
        authRoutes()
    }
}
