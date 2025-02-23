package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable

@Serializable
data class EpisodeDto(
    val id: String,
    val title: String?,
    val number: Int,
    val isFiller: Boolean,
)

@Serializable
data class RawEpisodeData(
    val status: Boolean,
    val html: String?,
)

@Serializable
data class EpisodeServerDto(
    val type: String,
    val serverName: String,
    val serverId: String,
)

@Serializable
data class RawEpisodeSourceData(
    val link: String?,
)