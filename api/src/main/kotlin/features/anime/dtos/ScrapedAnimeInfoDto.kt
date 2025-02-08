package xyz.aniways.features.anime.dtos

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import xyz.aniways.utils.nullIfZero

@Serializable
data class ScrapedAnimeInfoDto(
    val id: String,
    val name: String,
    val jname: String,
    val poster: String,
    val genre: String,
    val malId: Int?,
    val anilistId: Int?,
    val lastEpisode: Int?,
)

@Serializable
data class SyncData(
    val hianimeId: String,
    val malId: Int? = null,
    val anilistId: Int? = null
)

@Serializable
private data class SyncDataRaw(
    @SerialName("series_url")
    val seriesUrl: String,
    @SerialName("mal_id")
    val malId: String,
    @SerialName("anilist_id")
    val anilistId: String
)

val jsonConverter = Json {
    ignoreUnknownKeys = true
}

fun SyncData.Companion.fromJson(json: String): SyncData {
    val raw = jsonConverter.decodeFromString<SyncDataRaw>(json)

    return SyncData(
        hianimeId = raw.seriesUrl.split("/").last(),
        malId = raw.malId.toIntOrNull()?.nullIfZero(),
        anilistId = raw.anilistId.toIntOrNull()?.nullIfZero()
    )
}