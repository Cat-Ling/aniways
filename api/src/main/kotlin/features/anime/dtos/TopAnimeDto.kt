package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable

@Serializable
data class TopAnimeDto(
    val today: List<TopAnimeNodeDto>,
    val week: List<TopAnimeNodeDto>,
    val month: List<TopAnimeNodeDto>,
)

@Serializable
data class TopAnimeNodeDto(
    val id: String?,
    val hiAnimeId: String,
    val rank: Int,
    val name: String,
    val jname: String,
    val poster: String,
    val episodes: Int,
)
