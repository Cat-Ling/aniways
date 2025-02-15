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

    onCall { call ->
        val uri = call.request.uri

        val getAllTasksRegex = "/tasks".toRegex()
        val runTaskRegex = "/tasks/([a-zA-Z0-9]+)".toRegex()

        if (!this@createApplicationPlugin.application.isDev) {
            return@onCall call.respond(HttpStatusCode.NotFound)
        }

        when {
            getAllTasksRegex.matches(call.request.uri) -> {
                val response = tasks
                    .filter { it.frequency !is TaskScheduler.Frequency.OnStartUp }
                    .map { task -> task.toDto() }

                call.respond(response)
            }

            runTaskRegex.matches(call.request.uri) -> {
                val taskName = runTaskRegex.find(uri)!!.groupValues[1]

                val task = tasks.find {
                    it.name == taskName && it.frequency !is TaskScheduler.Frequency.OnStartUp
                } ?: return@onCall call.respondText(
                    "Task not found",
                    status = HttpStatusCode.NotFound
                )

                scope.launch {
                    scheduler.execute(task)
                }

                call.respondText("Task ${task.name} started")
            }

        }
    }

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