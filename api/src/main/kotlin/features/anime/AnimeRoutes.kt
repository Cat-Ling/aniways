package xyz.aniways.features.anime

import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.configureAnimeRoutes() {
    route("/anime") {
        get {
            call.respondText("Anime")
        }
    }
}