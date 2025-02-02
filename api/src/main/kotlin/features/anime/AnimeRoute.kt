package xyz.aniways.features.anime

import com.ucasoft.ktor.simpleCache.cacheOutput
import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.anime.services.AnimeService
import kotlin.time.Duration.Companion.days
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

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

    @Resource("/recently-updated")
    class RecentlyUpdated(val parent: AnimeRoute)

    @Resource("/trailer/{id}")
    class Trailer(val parent: AnimeRoute, val id: String)

    @Resource("/episodes/{id}")
    class Episodes(val parent: AnimeRoute, val id: String)
}

fun Route.animeRoutes() {
    val service by inject<AnimeService>()

    get<AnimeRoute.RecentlyUpdated> { route ->
        call.respond(service.getRecentlyUpdatedAnimes(route.parent.page, route.parent.itemsPerPage))
    }

    get<AnimeRoute.Metadata> { route ->
        val anime = service.getAnimeById(route.id)
        anime ?: return@get call.respond(HttpStatusCode.NotFound)
        call.respond(anime)
    }

    cacheOutput(invalidateAt = 7.days) {
        get<AnimeRoute.Seasonal> {
            call.respond(service.getSeasonalAnimes())
        }
    }

    cacheOutput(invalidateAt = 7.days) {
        get<AnimeRoute.Trending> {
            call.respond(service.getTrendingAnimes())
        }
    }

    cacheOutput(invalidateAt = 1.days) {
        get<AnimeRoute.Top> {
            call.respond(service.scrapeTopAnimes())
        }
    }

    cacheOutput(invalidateAt = 30.days) {
        get<AnimeRoute.Popular> {
            call.respond(service.getPopularAnimes())
        }
    }

    cacheOutput(
        invalidateAt = 1.hours,
        queryKeys = listOf("query", "page")
    ) {
        get<AnimeRoute.Search> { route ->
            call.respond(service.searchAnime(route.query, route.page))
        }
    }

    get<AnimeRoute.Trailer> { route ->
        val trailer = service.getAnimeTrailer(route.id)
        trailer ?: return@get call.respond(HttpStatusCode.NotFound)
        call.respond(trailer)
    }

    rateLimit {
        cacheOutput(invalidateAt = 3.minutes) {
            get<AnimeRoute.Episodes> { route ->
                call.respond(service.getEpisodesOfAnime(route.id))
            }
        }
    }
}