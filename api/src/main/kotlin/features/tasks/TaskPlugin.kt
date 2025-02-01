package xyz.aniways.features.tasks

import io.ktor.server.application.*
import io.ktor.server.application.hooks.*
import kotlinx.coroutines.*

val TaskScheduler = createApplicationPlugin(
    name = "TaskScheduler",
    createConfiguration = ::TaskSchedulerConfiguration,
) {
    val tasks = pluginConfig.tasks

    val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    on(MonitoringEvent(ApplicationStarted)) {
        val tasksByFrequency = tasks.groupBy { it.frequency }

        tasksByFrequency.forEach { (frequency, tasks) ->
            scope.launch {
                Task.Scheduler(frequency).schedule(tasks)
            }
        }
    }

    on(MonitoringEvent(ApplicationStopping)) {
        scope.cancel()
    }
}

class TaskSchedulerConfiguration {
    var tasks: List<Task> = emptyList()
}