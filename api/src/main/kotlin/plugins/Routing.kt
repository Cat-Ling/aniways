package xyz.aniways.plugins

import io.ktor.server.application.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import xyz.aniways.features.anime.animeRoutes
import xyz.aniways.features.auth.authRoutes
import xyz.aniways.features.library.libraryRoutes
import xyz.aniways.features.settings.settingsRoutes
import xyz.aniways.features.users.userRoutes

fun Application.configureRouting() {
    install(Resources)

    routing {
        authRoutes()
        settingsRoutes()
        animeRoutes()
        userRoutes()
        libraryRoutes()

        get("/") {
            call.respondText("Aniways API")
        }
    }
}
