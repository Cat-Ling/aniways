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
import kotlin.reflect.KClass
import kotlin.time.toKotlinDuration

class TaskScheduler {
    private val logger = KtorSimpleLogger("Scheduler")

    private val runningTasks = mutableSetOf<KClass<out Task>>()

    sealed interface Frequency {
        data object OnStartUp : Frequency
        data class Cron(val cron: String) : Frequency {
            init {
                parseCron()
            }

            val description: String by lazy {
                val descriptor = CronDescriptor.instance()
                val cron = parseCron()

                descriptor.describe(cron)
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

            if (this is Cron) return "Cron: $cron (${this.description})"

            return "Every " + name
                .replace("Every", "")
                .replaceFirstChar {
                    if (it.isLowerCase()) it.titlecase() else it.toString()
                }
        }
    }

    suspend fun execute(task: Task) = coroutineScope {
        val job = launch {
            if (runningTasks.contains(task::class)) {
                logger.warn("Task '${task.name}' is already running, skipping")
                return@launch
            }

            if (task.shouldNotRunWith.any { runningTasks.contains(it) }) {
                logger.warn("Task '${task.name}' should not run with '${task.shouldNotRunWith}', skipping")
                return@launch
            }

            runningTasks.add(task::class)

            logger.info("Executing task: ${task.name}")
            task.execute()
        }

        job.invokeOnCompletion {
            runningTasks.remove(task::class)
        }
    }

    suspend fun schedule(tasks: List<Task>, frequency: Frequency) = coroutineScope {
        if (frequency is Frequency.OnStartUp) {
            return@coroutineScope tasks.forEach { task ->
                launch {
                    execute(task)
                }
            }
        }

        frequency as Frequency.Cron

        val parsedCron = frequency.parseCron()
        val cronExecTime = ExecutionTime.forCron(parsedCron)
        val taskNames = tasks.joinToString("', '") { it.name }

        logger.info("Scheduling '${frequency.getCleanName()}' frequency tasks '$taskNames'")

        while (isActive) {
            val zoneTime = Instant.now().atZone(ZoneId.systemDefault())
            val nextExecution = cronExecTime.nextExecution(zoneTime).get()
            delay(Duration.between(Instant.now(), nextExecution).toKotlinDuration())

            tasks.map { async { execute(it) } }.awaitAll()

            logger.info("'${frequency.getCleanName()}' frequency tasks '$taskNames' completed")
        }
    }

}