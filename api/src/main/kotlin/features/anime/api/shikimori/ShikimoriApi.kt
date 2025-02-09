package xyz.aniways.features.anime.api.shikimori

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.runBlocking
import xyz.aniways.features.anime.api.shikimori.models.FranchiseResponse
import kotlin.time.Duration.Companion.hours

private const val MUTEX_OWNER = "shikimori"

class ShikimoriApi(
    private val httpClient: HttpClient,
) {
    private val baseUrl = "https://shikimori.one/api"

    private class CacheEntry<T>(
        val value: T,
        val expirationTime: Long,
    ) {
        val isExpired: Boolean
            get() = expirationTime < System.currentTimeMillis()
    }

    private val baseCache = mutableMapOf<Int, CacheEntry<FranchiseResponse?>>()
    private val derivedCache = mutableMapOf<Int, CacheEntry<Int>>()
    private val cacheExpirationDuration = 3.hours

    private fun cleanExpiredCache() {
        baseCache.entries.removeIf { it.value.isExpired }
        derivedCache.entries.removeIf { it.value.isExpired }
    }

    suspend fun getAnimeFranchise(malId: Int): FranchiseResponse = synchronized(MUTEX_OWNER) {
        return@synchronized runBlocking {
            cleanExpiredCache()

            baseCache[malId]?.let { cacheEntry ->
                if (!cacheEntry.isExpired) {
                    return@runBlocking cacheEntry.value ?: throw IllegalStateException("Cache entry is null")
                }
                baseCache.remove(malId) // Remove expired cache
            }

            derivedCache[malId]?.let { derivedEntry ->
                baseCache[derivedEntry.value]?.let { baseEntry ->
                    if (!baseEntry.isExpired) {
                        return@runBlocking baseEntry.value ?: throw IllegalStateException("Base cache entry is null")
                    }
                    baseCache.remove(derivedEntry.value) // Remove expired base cache
                }
                derivedCache.remove(malId) // Remove expired derived cache
            }

            val response = httpClient.get("$baseUrl/animes/$malId/franchise")
            val body = response.body<FranchiseResponse>()

            val malIds = body.nodes.mapNotNull { it.id }.filter { it != malId }

            baseCache[malId] = CacheEntry(
                value = body,
                expirationTime = System.currentTimeMillis() + cacheExpirationDuration.inWholeMilliseconds
            )

            derivedCache.putAll(malIds.map {
                it to CacheEntry(
                    value = malId,
                    expirationTime = System.currentTimeMillis() + cacheExpirationDuration.inWholeMilliseconds
                )
            })

            body
        }
    }
}