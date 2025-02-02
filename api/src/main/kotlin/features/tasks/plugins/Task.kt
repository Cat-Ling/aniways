package xyz.aniways.features.tasks.plugins

import io.ktor.util.logging.*
import xyz.aniways.utils.toStringOrNull
import kotlin.time.DurationUnit
import kotlin.time.toDuration

interface Task {
    val name: String
    val frequency: TaskScheduler.Frequency

    val logger get() = KtorSimpleLogger("Task - $name")

    suspend fun job()

    suspend fun execute() {
        val startTime = System.currentTimeMillis()
        logger.info("Starting task")

        try {
            job()
        } catch (e: Exception) {
            logger.error("Error running task: ${e.message} ${e.stackTraceToString()}")
        }

        val duration = (System.currentTimeMillis() - startTime).toDuration(DurationUnit.MILLISECONDS)

        val formatted = duration.toComponents { hours, minutes, seconds, nanoseconds ->
            listOfNotNull(
                if (hours > 0) "$hours h" else null,
                if (minutes > 0) "$minutes min" else null,
                if (seconds > 0) "$seconds s" else null,
                if (nanoseconds > 0) "${nanoseconds / 1_000_000} ms" else null
            ).joinToString(" ")
        }.toStringOrNull() ?: "0 ms"

        logger.info("Task took $formatted")
    }
}
