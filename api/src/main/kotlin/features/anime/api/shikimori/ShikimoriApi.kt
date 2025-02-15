package xyz.aniways.features.anime.api.shikimori

import io.github.crackthecodeabhi.kreds.args.SetOption
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.sync.Semaphore
import kotlinx.serialization.json.Json
import xyz.aniways.Env
import xyz.aniways.cache.runCacheQuery
import xyz.aniways.features.anime.api.shikimori.models.FranchiseResponse
import kotlin.time.Duration.Companion.hours

class ShikimoriApi(
    private val httpClient: HttpClient,
    private val redisConfig: Env.RedisConfig,
) {
    private val json = Json { ignoreUnknownKeys = true }
    private val baseUrl = "https://shikimori.one/api"

    private val cacheExpirationDuration = 3.hours

    private val semaphore = Semaphore(1)

    suspend fun getAnimeFranchise(malId: Int): FranchiseResponse = runCacheQuery(redisConfig) { redis ->
        semaphore.acquire()

        try {
            val parentMalId = redis.get("shikimori:anime:$malId:derived_from")?.toIntOrNull()

            val franchiseId = parentMalId ?: malId
            val cached = redis.get("shikimori:anime:$franchiseId:franchise")?.let {
                json.decodeFromString<FranchiseResponse>(it)
            }

            if (cached != null) return@runCacheQuery cached

            val response = httpClient.get("$baseUrl/animes/$malId/franchise")
            val body = response.body<FranchiseResponse>()

            redis.set(
                key = "shikimori:anime:$malId:franchise",
                value = json.encodeToString(FranchiseResponse.serializer(), body),
                setOption = SetOption.Builder()
                    .exSeconds(cacheExpirationDuration.inWholeSeconds.toULong())
                    .build()
            )

            val pipeline = redis.pipelined()
            body.nodes.mapNotNull { it.id }.filter { it != malId }.forEach {
                pipeline.set(
                    key = "shikimori:anime:$it:derived_from",
                    value = malId.toString(),
                    setOption = SetOption.Builder()
                        .exSeconds(cacheExpirationDuration.inWholeSeconds.toULong())
                        .build()
                )
            }
            pipeline.execute()

            body
        } finally {
            semaphore.release()
        }
    }
}