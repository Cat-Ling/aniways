package xyz.aniways.cache

import io.github.crackthecodeabhi.kreds.args.SetOption
import io.github.crackthecodeabhi.kreds.connection.Endpoint
import io.github.crackthecodeabhi.kreds.connection.KredsClient
import io.github.crackthecodeabhi.kreds.connection.newClient
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import xyz.aniways.Env
import kotlin.time.Duration
import kotlin.time.Duration.Companion.days

object RedisCache {
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

        cached?.let {
            Json.decodeFromString(cached)
        } ?: query().also {
            client.set(
                key = key,
                value = Json.encodeToString(it),
                setOption = SetOption.Builder()
                    .exSeconds(invalidatesAt.inWholeSeconds.toULong())
                    .build()
            )
        }
    }
}