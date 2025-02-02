package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable
import xyz.aniways.features.anime.api.mal.models.ListStatus

@Serializable
data class AnimeListDto(
    val pageInfo: PageInfo,
    val items: List<AnimeListNode>,
)

@Serializable
data class PageInfo(
    val currentPage: Int,
    val hasNextPage: Boolean,
    val hasPreviousPage: Boolean,
)

@Serializable
data class AnimeListNode(
    val id: String,
    val name: String,
    val jname: String,
    val poster: String,
    val totalEpisodes: Int,
    val mediaType: String,
    val mean: Double,
    val numScoringUsers: Int,
    val listStatus: ListStatus
)