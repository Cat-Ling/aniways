package xyz.aniways.features.anime.api.mal

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.serialization.json.JsonObject

class MalApi(
    private val httpClient: HttpClient,
) {
    private val baseUrl = "https://api.myanimelist.net/v2"

    suspend fun getAnimeMetadata(id: Int) {
        val response = httpClient.get("$baseUrl/anime/$id")
        val body = response.body<JsonObject>()
        println(body)
    }
}