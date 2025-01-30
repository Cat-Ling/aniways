package xyz.aniways.features.anime

import io.ktor.resources.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

@Resource("/anime")
data class Anime(val page: Int = 1, val itemsPerPage: Int = 30) {
    @Resource("/{id}")
    data class ById(val id: String)

    @Resource("/mal/{malId}")
    data class ByMalId(val malId: Int)

    @Resource("/list")
    data class InIds(
        val ids: List<String>?,
        val malIds: List<Int>?,
        val hiAnimeIds: List<String>?
    )
}

fun Route.animeRoutes() {
    get<Anime> { (page, itemsPerPage) ->
        call.respondText {
            "Get animes with page $page and items per page $itemsPerPage"
        }
    }
}