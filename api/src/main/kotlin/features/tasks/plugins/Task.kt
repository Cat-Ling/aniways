package xyz.aniways.features.tasks.plugins

import io.ktor.util.logging.*
import kotlinx.coroutines.*
import xyz.aniways.utils.toStringOrNull
import kotlin.time.DurationUnit
import kotlin.time.toDuration

interface Task {
    val name: String
    val frequency: Scheduler.Frequency

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

    class Scheduler(
        private val frequency: Frequency
    ) {
        private val logger = KtorSimpleLogger("Scheduler")

        enum class Frequency(val intervalMillis: Long) {
            ON_START_UP(Long.MAX_VALUE),
            EVERY_SECOND(1000L),
            EVERY_MINUTE(60 * 1000L),
            EVERY_HOUR(60 * 60 * 1000L),
            EVERY_DAY(24 * 60 * 60 * 1000L),
            EVERY_WEEK(7 * 24 * 60 * 60 * 1000L),
            EVERY_MONTH(30 * 24 * 60 * 60 * 1000L);

            fun getCleanName(): String {
                return name
                    .lowercase()
                    .split("_")
                    .joinToString(" ") {
                        it.replaceFirstChar { char -> char.uppercase() }
                    }
            }
        }

        suspend fun schedule(tasks: List<Task>) = coroutineScope {
            when (frequency) {
                Frequency.ON_START_UP -> {
                    tasks.forEach {
                        logger.info("Executing startup task: ${it.name}")
                        it.execute()
                    }
                }

                else -> {
                    val taskNames = tasks.joinToString("', '") { it.name }

                    logger.info("Scheduling tasks '$taskNames' to run ${frequency.getCleanName()}")

                    while (isActive) {
                        delay(frequency.intervalMillis)

                        logger.info("Running '${frequency.getCleanName()}' frequency tasks '$taskNames'")

                        val deferredTasks = tasks.map { task ->
                            async {
                                logger.info("Executing task: ${task.name}")
                                task.execute()
                            }
                        }

                        deferredTasks.joinAll()

                        logger.info("'${frequency.getCleanName()}' frequency tasks '$taskNames' completed")
                    }
                }

            }
        }
    }
}
