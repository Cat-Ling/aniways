package xyz.aniways.plugins

import io.ktor.server.application.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import xyz.aniways.features.auth.routes.authRoutes
import xyz.aniways.features.settings.routes.settingsRoutes

fun Application.configureRouting() {
    install(Resources)
    routing {
        authRoutes()
        settingsRoutes()

        get("/") {
            call.respondText("Aniways API")
        }
    }
}
