package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable

@Serializable
data class ScrapedTopAnimeDto(
    val today: List<ScrapedAnimeDto>,
    val week: List<ScrapedAnimeDto>,
    val month: List<ScrapedAnimeDto>,
)

@Serializable
data class TopAnimeDto(
    val today: List<AnimeDto>,
    val week: List<AnimeDto>,
    val month: List<AnimeDto>,
)
