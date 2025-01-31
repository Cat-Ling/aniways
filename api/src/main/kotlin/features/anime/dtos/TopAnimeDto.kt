package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable

@Serializable
data class TopAnimeDto(
    val today: List<ScrapedAnimeDto>,
    val week: List<ScrapedAnimeDto>,
    val month: List<ScrapedAnimeDto>,
)
