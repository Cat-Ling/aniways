package xyz.aniways.features.anime

import io.ktor.resources.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.anime.services.AnimeService
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

        @Resource("/banner")
        class Banner(val parent: Metadata)
    }

    @Resource("/seasonal")
    class Seasonal(val parent: AnimeRoute)

    @Resource("/trending")
    class Trending(val parent: AnimeRoute)

    @Resource("/popular")
    class Popular(val parent: AnimeRoute)

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

    cache(invalidateAt = 31.days) {
        get<AnimeRoute.Metadata.Banner> { route ->
            val banner = service.getBannerImage(route.parent.id)
            call.respond(mapOf("banner" to banner))
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