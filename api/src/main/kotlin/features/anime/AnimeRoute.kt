package xyz.aniways.features.anime

import io.ktor.resources.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.anime.services.AnimeService

@Resource("/anime")
class AnimeRoute(val page: Int = 1, val itemsPerPage: Int = 30) {
    @Resource("/{id}")
    class ById(val parent: AnimeRoute, val id: String)

    @Resource("/trending")
    class Trending(val parent: AnimeRoute)

    @Resource("/top")
    class Top(val parent: AnimeRoute)

    @Resource("/search")
    class Search(val parent: AnimeRoute, val query: String, val page: Int = 1)

    @Resource("/az")
    class AZ(val parent: AnimeRoute, val page: Int = 1)

    @Resource("/sync/{id}")
    class Sync(val parent: AnimeRoute, val id: String)

    @Resource("/mal/{malId}")
    class ByMalId(val parent: AnimeRoute, val malId: Int)

    @Resource("/list")
    class InIds(
        val parent: AnimeRoute,
        val ids: List<String>?,
        val malIds: List<Int>?,
        val hiAnimeIds: List<String>?
    )
}

fun Route.animeRoutes() {
    val service by inject<AnimeService>()

    get<AnimeRoute> { route ->
        call.respondText {
            "Get animes with page ${route.page} and items per page ${route.itemsPerPage}"
        }
    }

    get<AnimeRoute.Trending> {
        call.respond(service.getTrendingAnimes())
    }

    get<AnimeRoute.Top> {
        call.respond(service.getTopAnimes())
    }

    get<AnimeRoute.Search> { route ->
        call.respond(service.searchAnime(route.query, route.page))
    }

    get<AnimeRoute.AZ> { route ->
        call.respond(service.getAZList(route.page))
    }

    get<AnimeRoute.Sync> { route ->
        call.respond(service.getSyncData(route.id))
    }
}