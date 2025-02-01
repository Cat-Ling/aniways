package xyz.aniways.features.tasks

import io.ktor.server.application.*
import io.ktor.server.application.hooks.*
import io.ktor.util.logging.*
import kotlinx.coroutines.*
import java.util.*

internal val logger = KtorSimpleLogger("TaskScheduler")

val TaskScheduler = createApplicationPlugin(
    name = "TaskScheduler",
    createConfiguration = ::TaskSchedulerConfiguration,
) {
    val tasks = pluginConfig.tasks

    val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    on(MonitoringEvent(ApplicationStarted)) {
        val tasksByFrequency = tasks.groupBy { it.schedule.frequency }

        tasksByFrequency.forEach { (frequency, tasks) ->
            scope.launch {
                when (frequency) {
                    Task.Schedule.Frequency.NEVER -> {
                        tasks.forEach { task ->
                            logger.info("Executing startup task: ${task.name}")
                            task.execute()
                        }
                    }

                    else -> {
                        val taskNames = tasks.joinToString(", ") { it.name }
                        val cleanFreqName = frequency.name
                            .replace("EVERY_", "")
                            .lowercase()

                        logger.info("Scheduling tasks $taskNames to run every $cleanFreqName")

                        while (isActive) {
                            delay(frequency.intervalMillis)

                            val deferredTasks = tasks.map { task ->
                                async {
                                    logger.info("Executing scheduled task: ${task.name}")
                                    task.execute()
                                }
                            }

                            deferredTasks.joinAll()

                            val capitalizedFreq = cleanFreqName.replaceFirstChar {
                                it.titlecase(Locale.getDefault())
                            }
                            logger.info("$capitalizedFreq tasks $taskNames completed")
                        }
                    }
                }
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