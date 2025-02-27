package xyz.aniways.features.tasks

import xyz.aniways.features.anime.services.AnimeService
import xyz.aniways.features.tasks.plugins.Task
import xyz.aniways.features.tasks.plugins.TaskScheduler

class MetadataSaver(
    private val service: AnimeService,
): Task(
    frequency = TaskScheduler.Frequency.OnStartUp,
) {
    override suspend fun job() {
        service.saveMissingMetadata()
    }
}