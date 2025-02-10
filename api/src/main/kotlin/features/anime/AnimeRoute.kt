package xyz.aniways.features.anime

import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.resources.*
import io.ktor.server.resources.patch
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.anime.api.mal.models.MalStatus
import xyz.aniways.features.anime.api.mal.models.UpdateAnimeListRequest
import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.plugins.Auth
import xyz.aniways.plugins.cache
import kotlin.time.Duration.Companion.days
import kotlin.time.Duration.Companion.hours

@Resource("/anime")
class AnimeRoute(val page: Int = 1, val itemsPerPage: Int = 30) {
    @Resource("/{id}")
    class Metadata(val parent: AnimeRoute, val id: String) {
        @Resource("/seasons")
        class Seasons(val parent: Metadata)

        @Resource("/related")
        class Related(val parent: Metadata)

        @Resource("/franchise")
        class Franchise(val parent: Metadata)

        @Resource("/trailer")
        class Trailer(val parent: Metadata)

        @Resource("/episodes")
        class Episodes(val parent: Metadata)
    }

    @Resource("/seasonal")
    class Seasonal(val parent: AnimeRoute)

    @Resource("/trending")
    class Trending(val parent: AnimeRoute)

    @Resource("/popular")
    class Popular(val parent: AnimeRoute)

    @Resource("/top")
    class Top(val parent: AnimeRoute)

    @Resource("/search")
    class Search(val parent: AnimeRoute, val query: String, val genre: String? = null)

    @Resource("/recently-updated")
    class RecentlyUpdated(val parent: AnimeRoute)

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
    class ListOfUser(
        val parent: AnimeRoute,
        val username: String,
        val status: String? = null,
        val sort: String? = null
    )

    @Resource("/list/{id}")
    class List(val parent: AnimeRoute, val id: String)
}

fun Route.animeRoutes() {
    val service by inject<AnimeService>()

    get<AnimeRoute.RecentlyUpdated> { route ->
        val recentlyUpdatedAnimes = service.getRecentlyUpdatedAnimes(
            page = route.parent.page,
            itemsPerPage = route.parent.itemsPerPage
        )

        call.respond(recentlyUpdatedAnimes)
    }

    get<AnimeRoute.Metadata> { route ->
        val anime = service.getAnimeById(route.id)
        anime ?: return@get call.respond(HttpStatusCode.NotFound)
        call.respond(anime)
    }

    cache(invalidateAt = 7.days) {
        get<AnimeRoute.Metadata.Seasons> { route ->
            val seasons = service.getAnimeWatchOrder(route.parent.id)
            call.respond(seasons)
        }
    }

    cache(invalidateAt = 7.days) {
        get<AnimeRoute.Metadata.Related> { route ->
            val related = service.getRelatedAnime(route.parent.id)
            call.respond(related)
        }
    }

    cache(invalidateAt = 7.days) {
        get<AnimeRoute.Metadata.Franchise> { route ->
            val franchise = service.getFranchiseOfAnime(route.parent.id)
            call.respond(franchise)
        }
    }

    cache(invalidateAt = 7.days) {
        get<AnimeRoute.Seasonal> {
            call.respond(service.getSeasonalAnimes())
        }
    }

    cache(invalidateAt = 7.days) {
        get<AnimeRoute.Trending> {
            call.respond(service.getTrendingAnimes())
        }
    }

    cache(invalidateAt = 1.days) {
        get<AnimeRoute.Top> {
            call.respond(service.scrapeTopAnimes())
        }
    }

    cache(invalidateAt = 30.days) {
        get<AnimeRoute.Popular> {
            call.respond(service.getPopularAnimes())
        }
    }

    cache(invalidateAt = 1.hours) {
        get<AnimeRoute.Search> { route ->
            val result = service.searchAnime(
                query = route.query,
                genre = route.genre,
                page = route.parent.page,
                itemsPerPage = route.parent.itemsPerPage
            )

            call.respond(result)
        }
    }

    get<AnimeRoute.Metadata.Trailer> { route ->
        val trailer = service.getAnimeTrailer(route.parent.id)
        trailer ?: return@get call.respond(HttpStatusCode.NotFound)
        call.respond(mapOf("trailer" to trailer))
    }

    cache(invalidateAt = 1.hours) {
        get<AnimeRoute.Metadata.Episodes> { route ->
            call.respond(service.getEpisodesOfAnime(route.parent.id))
        }
    }

    cache(invalidateAt = 1.hours) {
        get<AnimeRoute.EpisodeServers> { route ->
            val servers = service.getServersOfEpisode(route.episodeId)

            call.respond(servers)
        }
    }

    authenticate(Auth.SESSION, strategy = AuthenticationStrategy.Optional) {
        get<AnimeRoute.ListOfUser> { route ->
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

    authenticate(Auth.SESSION) {
        patch<AnimeRoute.List> { route ->
            try {
                val principal = call.principal<Auth.UserPrincipal>()
                principal ?: return@patch call.respond(HttpStatusCode.Unauthorized)
                val body = call.receive<UpdateAnimeListRequest>()

                val status = MalStatus.fromValue(body.status)

                status ?: return@patch call.respond(HttpStatusCode.BadRequest)

                val res = service.updateAnimeListEntry(
                    token = principal.token,
                    id = route.id,
                    status = status,
                    score = body.score,
                    numWatchedEpisodes = body.numWatchedEpisodes
                )

                res?.let { call.respond(it) } ?: call.respond(HttpStatusCode.BadRequest)
            } catch (e: IllegalArgumentException) {
                if (e.message?.contains("Invalid UUID string") == true) {
                    return@patch call.respond(HttpStatusCode.BadRequest)
                }
                call.respond(HttpStatusCode.InternalServerError)
            }
        }

        delete<AnimeRoute.List> {
            try {
                val principal = call.principal<Auth.UserPrincipal>()
                principal ?: return@delete call.respond(HttpStatusCode.Unauthorized)

                val value = service.deleteAnimeListEntry(principal.token, it.id)

                call.respond(
                    if (value) HttpStatusCode.OK
                    else HttpStatusCode.BadRequest
                )
            } catch (e: IllegalArgumentException) {
                if (e.message?.contains("Invalid UUID string") == true) {
                    return@delete call.respond(HttpStatusCode.BadRequest)
                }
                call.respond(HttpStatusCode.InternalServerError)
            }
        }
    }

    cache(invalidateAt = 30.days) {
        get<AnimeRoute.Genres> {
            call.respond(service.getAllGenres())
        }
    }

    cache(invalidateAt = 7.days) {
        get<AnimeRoute.Genre> { route ->
            val animes = service.getAnimesByGenre(
                page = route.parent.page,
                itemsPerPage = route.parent.itemsPerPage,
                genre = route.genre
            )

            call.respond(animes)
        }
    }

    get<AnimeRoute.Random> {
        call.respond(service.getRandomAnime())
    }

    get<AnimeRoute.RandomGenre> { route ->
        val animes = service.getRandomAnimeByGenre(route.genre)

        call.respond(animes)
    }
}