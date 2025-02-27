package xyz.aniways.features.tasks

import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.joinAll
import kotlinx.coroutines.launch
import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.features.tasks.plugins.Task
import xyz.aniways.features.tasks.plugins.TaskScheduler
import xyz.aniways.utils.retryWithDelay
import kotlin.reflect.KClass

class HourlyRecentlyUpdatedScraperTask(
    private val service: AnimeService,
) : Task(
    frequency = TaskScheduler.Frequency.Cron("0 * * * *")
) {
    override val shouldNotRunWith: List<KClass<out Task>>
        get() = listOf(HourlyRecentlyUpdatedScraperTask::class)

    override suspend fun job() = coroutineScope {
        val ids = service.scrapeAndPopulateRecentlyUpdatedAnime(fromPage = 1)

        ids.map {
            launch {
                retryWithDelay { service.getAnimeById(it) }
            }
        }.joinAll()
    }
}