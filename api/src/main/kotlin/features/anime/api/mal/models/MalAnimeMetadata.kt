package xyz.aniways.features.anime.api.mal.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import xyz.aniways.features.anime.db.AnimeMetadata

@Serializable
data class MalAnimeMetadata(
    @SerialName("id") val id: Int,
    @SerialName("title") val title: String,
    @SerialName("main_picture") val mainPicture: MainPicture?,
    @SerialName("alternative_titles") val alternativeTitles: AlternativeTitles?,
    @SerialName("synopsis") val synopsis: String?,
    @SerialName("media_type") val mediaType: String,
    @SerialName("rating") val rating: String?,
    @SerialName("average_episode_duration") val averageEpisodeDuration: Int?,
    @SerialName("status") val status: String,
    @SerialName("num_episodes") val numEpisodes: Int?,
    @SerialName("studios") val studios: ArrayList<Studios>,
    @SerialName("rank") val rank: Int?,
    @SerialName("mean") val mean: Double?,
    @SerialName("num_scoring_users") val numScoringUsers: Int,
    @SerialName("popularity") val popularity: Int?,
    @SerialName("start_date") val startDate: String?,
    @SerialName("end_date") val endDate: String?,
    @SerialName("source") val source: String?,
    var trailer: String? = null
)

@Serializable
data class MainPicture(
    @SerialName("medium") val medium: String?,
    @SerialName("large") val large: String?
)

@Serializable
data class AlternativeTitles(
    @SerialName("synonyms") val synonyms: ArrayList<String> = arrayListOf(),
    @SerialName("en") val en: String? = null,
    @SerialName("ja") val ja: String? = null
)

@Serializable
data class Studios(
    @SerialName("id") val id: Int,
    @SerialName("name") val name: String
)

fun MalAnimeMetadata.toAnimeMetadata() = AnimeMetadata {
    this.malId = this@toAnimeMetadata.id
    this.description = this@toAnimeMetadata.synopsis ?: ""
    this.mainPicture = this@toAnimeMetadata.mainPicture?.large ?: this@toAnimeMetadata.mainPicture?.medium ?: ""
    this.mediaType = this@toAnimeMetadata.mediaType
    this.rating = this@toAnimeMetadata.rating
    this.avgEpDuration = this@toAnimeMetadata.averageEpisodeDuration
    this.airingStatus = this@toAnimeMetadata.status
    this.totalEpisodes = this@toAnimeMetadata.numEpisodes
    this.studio = this@toAnimeMetadata.studios.first().name
    this.rank = this@toAnimeMetadata.rank
    this.mean = this@toAnimeMetadata.mean
    this.scoringUsers = this@toAnimeMetadata.numScoringUsers
    this.popularity = this@toAnimeMetadata.popularity
    this.airingStart = this@toAnimeMetadata.startDate
    this.airingEnd = this@toAnimeMetadata.endDate
    this.source = this@toAnimeMetadata.source
    this.trailer = this@toAnimeMetadata.trailer
}