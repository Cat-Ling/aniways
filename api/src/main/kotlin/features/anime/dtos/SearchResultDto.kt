package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable

@Serializable
data class SearchResultDto(
    val id: String?,
    val hianimeId: String,
    val name: String,
    val jname: String,
    val episodes: String,
    val poster: String,
)