package xyz.aniways.plugins

import io.ktor.server.application.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import xyz.aniways.features.anime.animeRoutes
import xyz.aniways.features.auth.authRoutes
import xyz.aniways.features.settings.settingsRoutes

fun Application.configureRouting() {
    install(Resources)

    routing {
        authRoutes()
        settingsRoutes()
        animeRoutes()

        get("/") {
            call.respondText("Aniways API")
        }
    }
}
