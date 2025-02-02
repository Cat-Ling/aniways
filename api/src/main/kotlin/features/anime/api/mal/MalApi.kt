package xyz.aniways.features.anime.api.mal

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.util.*
import kotlinx.serialization.json.JsonObject
import xyz.aniways.Env
import xyz.aniways.features.anime.api.mal.models.MalAnimeMetadata

class MalApi(
    private val httpClient: HttpClient,
    private val env: Env
) {
    private val baseUrl = "https://api.myanimelist.net/v2"

    private fun HttpRequestBuilder.authorizeRequest() {
        header("X-MAL-CLIENT-ID", env.malCredentials.clientId)
    }

    private val fields = listOf(
        "alternative_titles",
        "synopsis",
        "main_picture",
        "media_type",
        "rating",
        "average_episode_duration",
        "status",
        "num_episodes",
        "studios",
        "rank",
        "mean",
        "num_scoring_users",
        "popularity",
        "start_date",
        "end_date",
        "source"
    )

    suspend fun getAnimeMetadata(id: Int): MalAnimeMetadata {
        val response = httpClient.get("$baseUrl/anime/$id") {
            url {
                parameters.append("fields", fields.joinToString(","))
            }
            authorizeRequest()
        }
        val body = response.body<MalAnimeMetadata>()
        return body
    }
}