package xyz.aniways.features.tasks

import kotlinx.coroutines.coroutineScope
import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.features.tasks.plugins.Task
import xyz.aniways.features.tasks.plugins.TaskScheduler

class AllAnimeScraperTask(
    private val service: AnimeService
) : Task {
    override val name = "AllAnimeScraperTask"
    override val frequency = TaskScheduler.Frequency.OnStartUp

    override suspend fun job() = coroutineScope {
        val count = service.getAnimeCount()

        if (count > 0) {
            logger.info("Skipping scraping all anime as the DB is not empty")
            logger.info("Scraping recently updated anime instead")
            service.scrapeAndPopulateRecentlyUpdatedAnime(fromPage = 2)
            return@coroutineScope
        }

        logger.info("DB is empty, scraping all anime")
        service.scrapeAndPopulateAnime()
        service.scrapeAndPopulateRecentlyUpdatedAnime()
    }
}
