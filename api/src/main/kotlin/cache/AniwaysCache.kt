package xyz.aniways.cache

import io.github.crackthecodeabhi.kreds.args.SetOption
import io.github.crackthecodeabhi.kreds.connection.Endpoint
import io.github.crackthecodeabhi.kreds.connection.KredsClient
import io.github.crackthecodeabhi.kreds.connection.newClient
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import xyz.aniways.Env
import kotlin.time.Duration
import kotlin.time.Duration.Companion.days

val logger: Logger = LoggerFactory.getLogger("AniwaysRedis")

object RedisCache {
    @Volatile
    private var client: KredsClient? = null

    fun getClient(credentials: Env.RedisConfig): KredsClient {
        return client ?: synchronized(this) {
            client ?: newClient(
                endpoint = Endpoint(
                    host = credentials.host,
                    port = credentials.port
                )
            ).also {
                client = it
                logger.info("🔌 Redis client initialized at ${credentials.host}:${credentials.port}")
            }
        }
    }
}

suspend fun <T> runCacheQuery(
    credentials: Env.RedisConfig,
    query: suspend (client: KredsClient) -> T
): T {
    val client = RedisCache.getClient(credentials)
    return query(client)
}

suspend inline fun <reified T : Any> getCachedOrRun(
    credentials: Env.RedisConfig,
    key: String,
    invalidatesAt: Duration = 1.days,
    crossinline query: suspend () -> T
): T {
    return runCacheQuery(credentials) { client ->
        val cached = client.get(key)

        if (cached != null) {
            logger.debug("✅ Cache hit for key: $key")
            try {
                return@runCacheQuery Json.decodeFromString(cached)
            } catch (e: Exception) {
                logger.warn("⚠️ Failed to decode cached value for key: $key. Falling back to query", e)
            }
        } else {
            logger.info("⛔ Cache miss for key: $key. Executing fallback query...")
        }

        val result = query()
        val ttl = invalidatesAt.inWholeSeconds.toULong()

        client.set(
            key = key,
            value = Json.encodeToString(result),
            setOption = SetOption.Builder().exSeconds(ttl).build()
        )
        logger.debug("💾 Cached result for key: $key (expires in ${ttl}s)")

        result
    }
}