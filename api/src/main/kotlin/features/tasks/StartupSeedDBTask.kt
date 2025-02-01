package xyz.aniways.features.tasks

import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.utils.retryWithDelay

class StartupSeedDBTask(
    private val service: AnimeService
) : Task {
    override val name = "StartupSeedDBTask"
    override val frequency = Task.Scheduler.Frequency.ON_START_UP

    override suspend fun job() = coroutineScope {
        var page = 1
        val count = service.getAnimeCount()
        if (count > 0) {
            logger.info("Anime DB already seeded")
            return@coroutineScope
        }
        do {
            logger.info("Fetching AZ list page $page")
            val animes = service.getAZList(page)

            val semaphore = Semaphore(10)
            val deferredAnimeInfo = animes.items.map { anime ->
                async {
                    semaphore.withPermit {
                        logger.info("Fetching anime info for ${anime.hianimeId}")
                        val animeInfo = retryWithDelay {
                            service.getAnimeInfo(anime.hianimeId)
                        }

                        animeInfo ?: return@async null

                        Anime {
                            name = animeInfo.name
                            jname = animeInfo.jname
                            poster = animeInfo.poster
                            genre = animeInfo.genre
                            hiAnimeId = anime.hianimeId
                            malId = animeInfo.malId
                            anilistId = animeInfo.anilistId
                            lastEpisode = animeInfo.lastEpisode
                        }
                    }
                }
            }

            val animeInfo = deferredAnimeInfo.awaitAll().filterNotNull()
            logger.info("Inserting ${animeInfo.size} animes")
            service.insertAnimes(animeInfo)
            delay(1000L)

            page++
        } while (animes.pageInfo.hasNextPage)
    }
}
