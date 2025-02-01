package xyz.aniways.features.tasks

import io.ktor.util.logging.*

abstract class Task {
    abstract val name: String
    abstract val schedule: Schedule

    protected val logger by lazy {
        KtorSimpleLogger("TaskScheduler: $name")
    }

    protected abstract suspend fun run()

    suspend fun execute() {
        val startTime = System.currentTimeMillis()
        logger.info("Running $name")

        try {
            run()
        } catch (e: Exception) {
            logger.error("Error running $name: ${e.message} ${e.stackTraceToString()}")
        }

        logger.info("Task $name took ${System.currentTimeMillis() - startTime}ms")
    }

    class Schedule(
        val frequency: Frequency
    ) {
        enum class Frequency(val intervalMillis: Long) {
            NEVER(Long.MAX_VALUE), // Never run
            EVERY_HOUR(60 * 60 * 1000L),
            EVERY_DAY(24 * 60 * 60 * 1000L),
            EVERY_WEEK(7 * 24 * 60 * 60 * 1000L),
            EVERY_MONTH(30 * 24 * 60 * 60 * 1000L)
        }
    }
}
