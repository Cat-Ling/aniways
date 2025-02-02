package xyz.aniways.features.tasks

import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.features.tasks.plugins.Task

class NewAnimeScraperTask(
    private val animeService: AnimeService
): Task {
    override val name: String = "NewAnimeScraperTask"
    override val frequency = Task.Scheduler.Frequency.EVERY_WEEK

    override suspend fun job() {
        animeService.scrapeAndPopulateNewAnime()
    }
}