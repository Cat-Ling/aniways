package xyz.aniways.features.anime

import io.ktor.resources.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.Env
import xyz.aniways.cache.getCachedOrRun
import xyz.aniways.features.anime.services.AnimeService
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
    val redisConfig by inject<Env.RedisConfig>()

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

    get<AnimeRoute.Metadata.Seasons> { route ->
        val seasons = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:${route.parent.id}:seasons",
            invalidatesAt = 7.days
        ) {
            service.getAnimeWatchOrder(route.parent.id)
        }

        call.respond(seasons)
    }

    get<AnimeRoute.Metadata.Related> { route ->
        val related = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:${route.parent.id}:related",
            invalidatesAt = 7.days
        ) {
            service.getRelatedAnime(route.parent.id)
        }

        call.respond(related)
    }

    get<AnimeRoute.Metadata.Franchise> { route ->
        val franchise = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:${route.parent.id}:franchise",
            invalidatesAt = 7.days
        ) {
            service.getFranchiseOfAnime(route.parent.id)
        }

        call.respond(franchise)
    }

    get<AnimeRoute.Metadata.Banner> { route ->
        val banner = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:${route.parent.id}:banner",
            invalidatesAt = 31.days
        ) {
            service.getBannerImage(route.parent.id)
        }

        call.respond(mapOf("banner" to banner))
    }

    get<AnimeRoute.Seasonal> {
        val seasonalAnime = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:seasonal",
            invalidatesAt = 7.days
        ) {
            service.getSeasonalAnimes()
        }

        call.respond(seasonalAnime)
    }

    get<AnimeRoute.Trending> {
        val trendingAnime = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:trending",
            invalidatesAt = 7.days
        ) {
            service.getTrendingAnimes()
        }

        call.respond(trendingAnime)
    }

    get<AnimeRoute.Popular> {
        val popularAnime = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:popular",
            invalidatesAt = 30.days
        ) {
            service.getPopularAnimes()
        }

        call.respond(popularAnime)
    }

    get<AnimeRoute.Search> { route ->
        val result = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:search:${route.query}:${route.genre}:${route.parent.page}:${route.parent.itemsPerPage}",
            invalidatesAt = 1.hours
        ) {
            service.searchAnime(
                query = route.query,
                genre = route.genre,
                page = route.parent.page,
                itemsPerPage = route.parent.itemsPerPage
            )
        }

        call.respond(result)
    }

    get<AnimeRoute.Metadata.Trailer> { route ->
        val trailer = service.getAnimeTrailer(route.parent.id)
        call.respond(mapOf("trailer" to trailer))
    }

    get<AnimeRoute.Metadata.Episodes> { route ->
        val episodes = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:${route.parent.id}:episodes",
            invalidatesAt = 1.hours
        ) {
            service.getEpisodesOfAnime(route.parent.id)
        }

        call.respond(episodes)
    }

    get<AnimeRoute.EpisodeServers> { route ->
        val servers = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:episode:${route.episodeId}:servers",
            invalidatesAt = 1.hours
        ) {
            service.getServersOfEpisode(route.episodeId)
        }

        call.respond(servers)
    }

    get<AnimeRoute.Genres> {
        val genres = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:genres",
            invalidatesAt = 30.days
        ) {
            service.getAllGenres()
        }

        call.respond(genres)
    }

    get<AnimeRoute.Genre> { route ->
        val animes = getCachedOrRun(
            credentials = redisConfig,
            key = "anime:genre:${route.genre}:${route.parent.page}:${route.parent.itemsPerPage}",
            invalidatesAt = 7.days
        ) {
            service.getAnimesByGenre(
                page = route.parent.page,
                itemsPerPage = route.parent.itemsPerPage,
                genre = route.genre
            )
        }

        call.respond(animes)
    }

    get<AnimeRoute.Random> {
        call.respond(service.getRandomAnime())
    }

    get<AnimeRoute.RandomGenre> { route ->
        val animes = service.getRandomAnimeByGenre(route.genre)

        call.respond(animes)
    }
}