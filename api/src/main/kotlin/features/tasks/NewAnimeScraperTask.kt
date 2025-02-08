package xyz.aniways.features.tasks

import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.features.tasks.plugins.Task
import xyz.aniways.features.tasks.plugins.TaskScheduler

class NewAnimeScraperTask(
    private val animeService: AnimeService
) : Task {
    override val name: String = "NewAnimeScraperTask"
    override val frequency = TaskScheduler.Frequency.Cron("0 0 * * 0") // every Sunday at midnight

    override suspend fun job() {
        animeService.scrapeAndPopulateNewAnime()
    }
}