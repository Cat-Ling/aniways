package xyz.aniways.features.tasks

import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.dtos.ScrapedAnimeInfoDto
import xyz.aniways.features.anime.services.AnimeService

class StartupSeedDBTask(
    private val service: AnimeService
) : Task() {
    override val name: String = "StartupSeedDBTask"
    override val schedule: Schedule = Schedule(Schedule.Frequency.NEVER)

    override suspend fun run() = coroutineScope {
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
                        val result = kotlin.runCatching {
                            service.getAnimeInfo(anime.hianimeId)
                        }.recover { e ->
                            var result: Result<ScrapedAnimeInfoDto>
                            var maxRetry = 10

                            do {
                                logger.error("Error fetching anime info for ${anime.hianimeId}: ${e.message} (${maxRetry} retries left)")
                                delay(2000L)
                                logger.info("Retrying anime info for ${anime.hianimeId}")
                                result = kotlin.runCatching {
                                    service.getAnimeInfo(anime.hianimeId)
                                }
                                maxRetry--
                            } while (result.isFailure && maxRetry > 0)

                            result.getOrNull()
                        }

                        val animeInfo = result.getOrNull() ?: return@async null

                        Anime {
                            this.name = animeInfo.name
                            this.jname = animeInfo.jname
                            this.poster = animeInfo.poster
                            this.genre = animeInfo.genre
                            this.hiAnimeId = anime.hianimeId
                            this.malId = animeInfo.malId
                            this.anilistId = animeInfo.anilistId
                            this.lastEpisode = animeInfo.lastEpisode
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
