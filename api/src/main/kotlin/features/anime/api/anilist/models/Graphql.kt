package xyz.aniways.features.anime.api.anilist.models

import kotlinx.serialization.Serializable

@Serializable
data class Graphql<T>(
    val query: String,
    val variables: T?,
)
