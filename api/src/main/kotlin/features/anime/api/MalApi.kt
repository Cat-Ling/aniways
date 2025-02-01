package xyz.aniways.features.anime.api

import io.ktor.client.*

class MalApi(
    private val httpClient: HttpClient,
) {
    private val baseUrl = "https://api.myanimelist.net/v2"

    suspend fun getSpotlightSeasonalAnime() {
        
    }
}