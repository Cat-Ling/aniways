package xyz.aniways.features.anime.api.anilist

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import xyz.aniways.features.anime.api.anilist.models.*
import java.util.*

class AnilistApi(
    private val httpClient: HttpClient,
) {
    private val baseUrl = "https://graphql.anilist.co"

    private suspend fun makeMediaRequest(body: HttpRequestBuilder.() -> Unit): List<AnilistAnime> {
        val response = httpClient.post(baseUrl) {
            contentType(ContentType.Application.Json)
            accept(ContentType.Application.Json)

            body()
        }

        val rawResponse = response.body<RawResponse>()

        return rawResponse.data.page.media.map {
            AnilistAnime(
                anilistId = it.id,
                malId = it.idMal,
                title = it.title.romaji,
                bannerImage = it.bannerImage,
                coverImage = it.coverImage.large,
                description = it.description,
                startDate = Calendar.getInstance().apply {
                    if (it.startDate.year == null || it.startDate.month == null || it.startDate.day == null) {
                        set(1970, 0, 1)
                    } else {
                        set(it.startDate.year, it.startDate.month, it.startDate.day)
                    }
                }.timeInMillis,
                type = it.format,
                episodes = it.episodes,
            )
        }
    }

    suspend fun getBanner(malId: Int): AnilistAnime {
        val response = httpClient.post(baseUrl) {
            contentType(ContentType.Application.Json)
            accept(ContentType.Application.Json)

            setBody(
                Graphql(
                    query = Queries.ANIME_DETAILS,
                    variables = mapOf("idMal" to malId)
                )
            )
        }

        val rawResponse = response.body<RawBannerResponse>()

        return AnilistAnime(
            anilistId = rawResponse.data.media.id,
            malId = rawResponse.data.media.idMal,
            title = rawResponse.data.media.title.romaji,
            bannerImage = rawResponse.data.media.bannerImage,
            coverImage = rawResponse.data.media.coverImage.large,
            description = rawResponse.data.media.description,
            startDate = Calendar.getInstance().apply {
                if (rawResponse.data.media.startDate.year == null || rawResponse.data.media.startDate.month == null || rawResponse.data.media.startDate.day == null) {
                    set(1970, 0, 1)
                } else {
                    set(
                        rawResponse.data.media.startDate.year,
                        rawResponse.data.media.startDate.month,
                        rawResponse.data.media.startDate.day
                    )
                }
            }.timeInMillis,
            type = rawResponse.data.media.format,
            episodes = rawResponse.data.media.episodes,
        )
    }

    suspend fun getSeasonalAnime(): List<AnilistAnime> {
        val currentYear = Calendar.getInstance().get(Calendar.YEAR)
        val currentMonth = Calendar.getInstance().get(Calendar.MONTH)

        val season = when (currentMonth) {
            in 1..3 -> "WINTER" // February to April
            in 4..6 -> "SPRING" // May to July
            in 7..9 -> "SUMMER" // August to October
            else -> "FALL"  // November to January
        }

        return makeMediaRequest {
            setBody(
                Graphql(
                    query = Queries.SEASONAL_ANIME,
                    variables = SeasonalAnimeRequest(
                        year = currentYear,
                        season = season,
                    )
                )
            )
        }
    }

    suspend fun getTrendingAnime(): List<AnilistAnime> {
        return makeMediaRequest {
            setBody(
                Graphql(
                    query = Queries.TRENDING_ANIME,
                    variables = null
                )
            )
        }
    }

    suspend fun getAllTimePopularAnime(): List<AnilistAnime> {
        return makeMediaRequest {
            setBody(
                Graphql(
                    query = Queries.POPULAR_ANIME,
                    variables = null
                )
            )
        }
    }
}