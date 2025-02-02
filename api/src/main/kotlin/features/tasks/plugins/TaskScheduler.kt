package xyz.aniways.features.tasks.plugins

import com.cronutils.descriptor.CronDescriptor
import com.cronutils.model.CronType
import com.cronutils.model.definition.CronDefinitionBuilder
import com.cronutils.model.time.ExecutionTime
import com.cronutils.parser.CronParser
import io.ktor.util.logging.*
import kotlinx.coroutines.*
import java.time.Duration
import java.time.Instant
import java.time.ZoneId

class TaskScheduler(
    private val frequency: Frequency
) {
    private val logger = KtorSimpleLogger("Scheduler")

    sealed class Frequency(val intervalMillis: Long) {
        data object OnStartUp : Frequency(Long.MAX_VALUE)
        data object EverySecond : Frequency(1000L)
        data object EveryMinute : Frequency(60 * 1000L)
        data object EveryHour : Frequency(60 * 60 * 1000L)
        data object EveryDay : Frequency(24 * 60 * 60 * 1000L)
        data object EveryWeek : Frequency(7 * 24 * 60 * 60 * 1000L)
        data object EveryMonth : Frequency(30 * 24 * 60 * 60 * 1000L)

        data class Cron(val cron: String) : Frequency(Long.MAX_VALUE) {
            init {
                parseCron()
            }

            fun parseCron(): com.cronutils.model.Cron {
                val builder = CronDefinitionBuilder.instanceDefinitionFor(CronType.UNIX)
                val parser = CronParser(builder)

                return parser.parse(cron)
            }
        }


        fun getCleanName(): String {
            val name = this::class.simpleName ?: return "Unknown"

            if (this is OnStartUp) return "On Startup"

            if (this is Cron) return "Cron: $cron"

            return "Every " + name
                .replace("Every", "")
                .replaceFirstChar {
                    if (it.isLowerCase()) it.titlecase() else it.toString()
                }
        }
    }

    suspend fun schedule(tasks: List<Task>) = coroutineScope {
        when (frequency) {
            Frequency.OnStartUp -> {
                tasks.forEach {
                    logger.info("Executing startup task: ${it.name}")
                    it.execute()
                }
            }

            is Frequency.Cron -> {
                val parsedCron = frequency.parseCron()
                val cronExecTime = ExecutionTime.forCron(parsedCron)
                val descriptor = CronDescriptor.instance()

                logger.info("Scheduling tasks to run ${frequency.getCleanName()} (${descriptor.describe(parsedCron)}): ${tasks.joinToString { it.name }}")

                while (isActive) {
                    val nextExecution = cronExecTime.nextExecution(
                        Instant.now().atZone(ZoneId.systemDefault())
                    ).get()
                    val delayMillis = Duration.between(Instant.now(), nextExecution).toMillis()
                    delay(delayMillis)

                    logger.info("Running '${frequency.getCleanName()}' frequency tasks")

                    val deferredTasks = tasks.map { task ->
                        async {
                            logger.info("Executing task: ${task.name}")
                            task.execute()
                        }
                    }

                    deferredTasks.joinAll()

                    logger.info("'${frequency.getCleanName()}' frequency tasks completed")
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