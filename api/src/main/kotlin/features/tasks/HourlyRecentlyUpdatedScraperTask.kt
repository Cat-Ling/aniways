package xyz.aniways.features.tasks

import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.features.tasks.plugins.Task
import xyz.aniways.features.tasks.plugins.TaskScheduler
import kotlin.reflect.KClass

class HourlyRecentlyUpdatedScraperTask(
    private val service: AnimeService,
) : Task(
    frequency = TaskScheduler.Frequency.Cron("0 * * * *")
) {
    override val shouldNotRunWith: List<KClass<out Task>>
        get() = listOf(HourlyRecentlyUpdatedScraperTask::class)

    override suspend fun job() {
        service.scrapeAndPopulateRecentlyUpdatedAnime(fromPage = 1)
    }
}