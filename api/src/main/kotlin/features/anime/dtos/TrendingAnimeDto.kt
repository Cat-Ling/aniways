package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable

@Serializable
data class TrendingAnimeDto(
    val id: String?,
    val hiAnimeId: String,
    val rank: Int,
    val name: String,
    val jname: String,
    val poster: String,
)