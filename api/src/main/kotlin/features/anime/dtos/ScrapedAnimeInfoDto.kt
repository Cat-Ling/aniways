package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable

@Serializable
data class ScrapedAnimeInfoDto(
    val id: String,
    val name: String,
    val jname: String,
    val poster: String,
    val genre: String,
    val malId: Int?,
    val anilistId: Int?,
    val lastEpisode: Int?,
)