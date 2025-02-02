package xyz.aniways.features.tasks

import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.features.tasks.plugins.Task

class RecentlyUpdatedScraperTask(
    private val service: AnimeService,
) : Task {
    override val name = "RecentlyUpdatedScraperTask"
    override val frequency = Task.Scheduler.Frequency.EVERY_HOUR

    override suspend fun job() {
        service.scrapeAndPopulateRecentlyUpdatedAnime(fromPage = 2)
    }
}