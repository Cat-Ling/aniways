package xyz.aniways.features.tasks

import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.features.tasks.plugins.Task
import xyz.aniways.features.tasks.plugins.TaskScheduler

class RecentlyUpdatedScraperTask(
    private val service: AnimeService,
) : Task {
    override val name = "RecentlyUpdatedScraperTask"
    override val frequency = TaskScheduler.Frequency.Cron("0 * * * *") // Every hour

    override suspend fun job() {
        service.scrapeAndPopulateRecentlyUpdatedAnime(fromPage = 2)
    }
}