package xyz.aniways.features.anime.api.shikimori

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import xyz.aniways.features.anime.api.shikimori.models.FranchiseResponse

class ShikimoriApi(
    private val httpClient: HttpClient,
) {
    private val baseUrl = "https://shikimori.one/api"

    suspend fun getAnimeFranchise(malId: Int): FranchiseResponse {
        val response = httpClient.get("$baseUrl/animes/$malId/franchise")
        val body = response.body<FranchiseResponse>()
        return body
    }
}