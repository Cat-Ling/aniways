package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable

@Serializable
data class AnimeDto(
    val id: String,
    val name: String,
    val jname: String,
    val description: String,
    val poster: String,
    val hiAnimeId: String,
    val malId: Int?,
    val anilistId: Int?,
    val lastEpisode: Int?,
    val createdAt: Long,
    val animeMetadata: AnimeMetadataDto?
)

@Serializable
data class AnimeMetadataDto(
    val malId: Int,
    val mainPicture: String,
    val mediaType: String,
    val rating: String?,
    val avgEpDuration: Int?,
    val airingStatus: String,
    val totalEpisodes: Int?,
    val studio: String?,
    val rank: Int?,
    val mean: Int?,
    val scoringUsers: Int,
    val popularity: Int?,
    val airingStart: String?,
    val airingEnd: String?,
    val source: String?,
    val trailer: String?,
    val createdAt: Long,
    val lastUpdatedAt: Long
)
