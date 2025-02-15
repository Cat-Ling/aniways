package xyz.aniways.cache

import io.github.crackthecodeabhi.kreds.connection.Endpoint
import io.github.crackthecodeabhi.kreds.connection.KredsClient
import io.github.crackthecodeabhi.kreds.connection.newClient
import xyz.aniways.Env

suspend fun <T> runCacheQuery(
    credentials: Env.RedisConfig,
    query: suspend (client: KredsClient) -> T
): T {
    val endpoint = Endpoint(host = credentials.host, port = credentials.port)

    return newClient(endpoint).use { client ->
        query(client)
    }
}