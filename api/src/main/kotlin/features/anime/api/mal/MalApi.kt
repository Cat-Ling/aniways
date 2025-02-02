package xyz.aniways.features.anime.api.mal

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.serialization.json.JsonObject
import xyz.aniways.Env
import xyz.aniways.features.anime.api.mal.models.MalAnimeList
import xyz.aniways.features.anime.api.mal.models.MalAnimeMetadata
import xyz.aniways.utils.getDocument

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

    suspend fun getTrailer(id: Int): String? {
        val document = httpClient.getDocument("https://myanimelist.net/anime/$id")
        val trailer = document.selectFirst("a.iframe")?.attr("href")
        return trailer
    }

    suspend fun getListOfUserAnimeList(
        username: String,
        page: Int,
        itemsPerPage: Int,
        token: String?,
        status: String?,
        sort: String?
    ): MalAnimeList {
        val fields = listOf(
            "list_status",
            *this.fields.map { "node.$it" }.toTypedArray()
        )

        val response = httpClient.get("$baseUrl/users/$username/animelist") {
            url {
                parameters.append("fields", fields.joinToString(","))
                status?.let { parameters.append("status", it) }
                sort?.let { parameters.append("sort", it) }
                parameters.append("limit", itemsPerPage.toString())
                parameters.append("offset", ((page - 1) * itemsPerPage).toString())
            }
            token?.let { header("Authorization", "Bearer $it") } ?: authorizeRequest()
        }

        val animelist = response.body<MalAnimeList>()

        return animelist.copy(
            paging = animelist.paging?.copy(
                next = animelist.paging?.next?.let { "/anime/list/$username?page=${page + 1}" },
                previous = animelist.paging?.previous?.let { "/anime/list/$username?page=${page - 1}" }
            )
        )
    }
}