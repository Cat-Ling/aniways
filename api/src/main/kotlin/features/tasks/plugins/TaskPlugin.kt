package xyz.aniways.features.tasks.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.application.hooks.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import kotlinx.coroutines.*
import xyz.aniways.isDev

val TaskSchedulerPlugin = createApplicationPlugin(
    name = "TaskSchedulerPlugin",
    createConfiguration = ::TaskSchedulerPluginConfiguration,
) {
    val tasks = pluginConfig.tasks
    val scheduler = TaskScheduler()
    val tasksByFrequency = tasks.groupBy { it.frequency }
    val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    on(MonitoringEvent(ApplicationStarted)) {
        val startUpTasks = tasksByFrequency[TaskScheduler.Frequency.OnStartUp] ?: emptyList()

        startUpTasks.forEach { task ->
            scope.launch {
                scheduler.execute(task)
            }
        }

        tasksByFrequency.filter {
            it.key !is TaskScheduler.Frequency.OnStartUp
        }.forEach {
            scope.launch {
                scheduler.schedule(it.value, it.key)
            }
        }
    }

    on(MonitoringEvent(ApplicationStopping)) {
        scope.cancel()
    }
}

class TaskSchedulerPluginConfiguration {
    var tasks: List<Task> = emptyList()
}