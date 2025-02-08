package xyz.aniways.models

import kotlinx.serialization.Serializable

@Serializable
data class PageInfo(
    val totalPage: Int,
    val currentPage: Int,
    val hasNextPage: Boolean,
    val hasPreviousPage: Boolean
)

@Serializable
data class Pagination<T>(
    val pageInfo: PageInfo,
    val items: List<T>
)