package xyz.aniways.features.anime.api.mal

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.http.content.*
import kotlinx.serialization.json.JsonObject
import xyz.aniways.Env
import xyz.aniways.features.anime.api.mal.models.MalStatus
import xyz.aniways.features.anime.api.mal.models.MalAnimeList
import xyz.aniways.features.anime.api.mal.models.MalAnimeMetadata
import xyz.aniways.features.anime.api.mal.models.UpdateAnimeListRequest
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

    suspend fun updateAnimeListEntry(
        token: String,
        id: Int,
        status: MalStatus,
        score: Int,
        numWatchedEpisodes: Int,
    ): UpdateAnimeListRequest {
        val response = httpClient.submitForm(
            url = "$baseUrl/anime/$id/my_list_status",
            formParameters = parameters {
                append("status", status.value)
                append("score", score.toString())
                append("num_watched_episodes", numWatchedEpisodes.toString())
            }
        ) {
            header("Authorization", "Bearer $token")
            method = HttpMethod.Patch
        }

        if (response.status != HttpStatusCode.OK) {
            throw Exception("Failed to update anime list entry")
        }

        return UpdateAnimeListRequest(
            status = status.value,
            score = score,
            numWatchedEpisodes = numWatchedEpisodes
        )
    }

    suspend fun deleteAnimeListEntry(
        token: String,
        id: Int
    ) {
        httpClient.delete("$baseUrl/anime/$id/my_list_status") {
            header("Authorization", "Bearer $token")
        }
    }
}