package xyz.aniways.features.tasks.plugins

import io.ktor.server.application.*
import io.ktor.server.application.hooks.*
import kotlinx.coroutines.*

val TaskSchedulerPlugin = createApplicationPlugin(
    name = "TaskSchedulerPlugin",
    createConfiguration = ::TaskSchedulerPluginConfiguration,
) {
    val tasks = pluginConfig.tasks

    val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    on(MonitoringEvent(ApplicationStarted)) {
        val tasksByFrequency = tasks.groupBy { it.frequency }

        tasksByFrequency.forEach { (frequency, tasks) ->
            scope.launch {
                TaskScheduler(frequency).schedule(tasks)
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