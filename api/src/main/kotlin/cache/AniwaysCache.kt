package xyz.aniways.cache

import io.github.crackthecodeabhi.kreds.connection.Endpoint
import io.github.crackthecodeabhi.kreds.connection.KredsClient
import io.github.crackthecodeabhi.kreds.connection.newClient
import xyz.aniways.Env

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