package xyz.aniways.features.anime.api.shikimori.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class FranchiseResponse(
    @SerialName("links") var links: List<Links> = emptyList(),
    @SerialName("nodes") var nodes: List<Nodes> = emptyList(),
    @SerialName("current_id") var currentId: Int? = null
)

@Serializable
data class Links(
    @SerialName("id") var id: Int? = null,
    @SerialName("source_id") var sourceId: Int? = null,
    @SerialName("target_id") var targetId: Int? = null,
    @SerialName("source") var source: Int? = null,
    @SerialName("target") var target: Int? = null,
    @SerialName("weight") var weight: Int? = null,
    @SerialName("relation") var relation: String? = null
)

@Serializable
data class Nodes(
    @SerialName("id") var id: Int? = null,
    @SerialName("date") var date: Int? = null,
    @SerialName("name") var name: String? = null,
    @SerialName("image_url") var imageUrl: String? = null,
    @SerialName("url") var url: String? = null,
    @SerialName("year") var year: Int? = null,
    @SerialName("kind") var kind: String? = null,
    @SerialName("weight") var weight: Int? = null,
)