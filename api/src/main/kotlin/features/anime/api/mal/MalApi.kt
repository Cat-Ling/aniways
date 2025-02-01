package xyz.aniways.features.anime.api.mal

import io.ktor.client.*

class MalApi(
    private val httpClient: HttpClient,
) {
    private val baseUrl = "https://api.myanimelist.net/v2"
}