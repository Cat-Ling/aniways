package xyz.aniways.plugins

import io.ktor.server.application.*
import org.koin.ktor.ext.get
import xyz.aniways.features.tasks.StartupSeedDBTask
import xyz.aniways.features.tasks.TaskScheduler

fun Application.configureTaskScheduler() {
    install(TaskScheduler) {
        tasks = listOf(StartupSeedDBTask(get()))
    }
}