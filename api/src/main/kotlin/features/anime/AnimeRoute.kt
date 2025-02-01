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
    class Metadata(val parent: AnimeRoute, val id: String)

    @Resource("/seasonal")
    class Seasonal(val parent: AnimeRoute)

    @Resource("/trending")
    class Trending(val parent: AnimeRoute)

    @Resource("/popular")
    class Popular(val parent: AnimeRoute)

    @Resource("/top")
    class Top(val parent: AnimeRoute)

    @Resource("/search")
    class Search(val parent: AnimeRoute, val query: String, val page: Int = 1)
}

fun Route.animeRoutes() {
    val service by inject<AnimeService>()

    get<AnimeRoute.Seasonal> {
        call.respond(service.getSeasonalAnimes())
    }

    get<AnimeRoute.Trending> {
        call.respond(service.getTrendingAnimes())
    }

    get<AnimeRoute.Top> {
        call.respond(service.getTopAnimes())
    }

    get<AnimeRoute.Popular> {
        call.respond(service.getPopularAnimes())
    }

    get<AnimeRoute.Search> { route ->
        call.respond(service.searchAnime(route.query, route.page))
    }

}