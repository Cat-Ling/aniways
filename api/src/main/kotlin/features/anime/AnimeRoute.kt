package xyz.aniways.features.anime

import com.ucasoft.ktor.simpleCache.cacheOutput
import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.plugins.Auth
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

    @Resource("/episodes/servers/{episodeId}")
    class EpisodeServers(val parent: AnimeRoute, val episodeId: String)

    @Resource("/genres")
    class Genres(val parent: AnimeRoute)

    @Resource("/genres/{genre}")
    class Genre(val parent: AnimeRoute, val genre: String)

    @Resource("/random")
    class Random(val parent: AnimeRoute)

    @Resource("/random/{genre}")
    class RandomGenre(val parent: AnimeRoute, val genre: String)

    @Resource("/list/{username}")
    class List(
        val parent: AnimeRoute,
        val username: String,
        val status: String? = null,
        val sort: String? = null
    )
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

    rateLimit {
        cacheOutput(invalidateAt = 3.minutes) {
            get<AnimeRoute.EpisodeServers> { route ->
                call.respond(service.getServersOfEpisode(route.episodeId))
            }
        }
    }

    authenticate(Auth.SESSION, strategy = AuthenticationStrategy.Optional) {
        get<AnimeRoute.List> { route ->
            val token = call.principal<Auth.UserPrincipal>()?.token

            val animeList = service.getUserAnimeList(
                username = route.username,
                token = token,
                status = route.status,
                sort = route.sort,
                page = route.parent.page,
                itemsPerPage = route.parent.itemsPerPage
            )

            call.respond(animeList)
        }
    }
}