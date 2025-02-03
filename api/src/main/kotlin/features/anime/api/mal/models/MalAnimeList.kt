package xyz.aniways.features.anime.api.mal.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable


@Serializable
data class MalAnimeList(
    @SerialName("data") var data: ArrayList<Data> = arrayListOf(),
    @SerialName("paging") var paging: Paging? = Paging()
)

@Serializable
data class ListStatus(
    @SerialName("status") var status: String? = null,
    @SerialName("score") var score: Int? = null,
    @SerialName("num_episodes_watched") var numEpisodesWatched: Int? = null,
    @SerialName("is_rewatching") var isRewatching: Boolean? = null,
    @SerialName("updated_at") var updatedAt: String? = null,
    @SerialName("finish_date") var finishDate: String? = null
)


@Serializable
data class Data(
    @SerialName("node") var node: MalAnimeMetadata?,
    @SerialName("list_status") var listStatus: ListStatus? = ListStatus()
)

@Serializable
data class Paging(
    @SerialName("next") var next: String? = null,
    @SerialName("previous") var previous: String? = null
)
