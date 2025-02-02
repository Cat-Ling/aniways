package xyz.aniways.features.tasks

import kotlinx.coroutines.coroutineScope
import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.features.tasks.plugins.Task

class AllAnimeScraperTask(
    private val service: AnimeService
) : Task {
    override val name = "AllAnimeScraperTask"
    override val frequency = Task.Scheduler.Frequency.ON_START_UP

    override suspend fun job() = coroutineScope {
        val count = service.getAnimeCount()

        if (count > 0) {
            logger.info("Anime DB already seeded")
            return@coroutineScope
        }

        // Will only run if the DB
        // is empty essentially new installation of server
        service.scrapeAndPopulateAnime()
        service.scrapeAndPopulateRecentlyUpdatedAnime()
    }
}
