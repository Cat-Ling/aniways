package xyz.aniways.plugins

import io.ktor.server.application.*
import org.koin.ktor.ext.get
import xyz.aniways.features.tasks.FreshServerInstallSeeder
import xyz.aniways.features.tasks.HourlyRecentlyUpdatedScraperTask
import xyz.aniways.features.tasks.plugins.TaskSchedulerPlugin

fun Application.configureTaskScheduler() {
    install(TaskSchedulerPlugin) {
        tasks = listOf(
            FreshServerInstallSeeder(get()),
            HourlyRecentlyUpdatedScraperTask(get()),
        )
    }
}