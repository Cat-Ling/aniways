package xyz.aniways.features.anime.dtos

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import xyz.aniways.utils.nullIfZero

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
    val malId: Int?,
    @SerialName("anilist_id")
    val anilistId: Int?
)

val jsonConverter = Json {
    ignoreUnknownKeys = true
}

fun SyncData.Companion.fromJson(json: String): SyncData {
    val raw = jsonConverter.decodeFromString<SyncDataRaw>(json)

    return SyncData(
        hianimeId = raw.seriesUrl.split("/").last(),
        malId = raw.malId?.nullIfZero(),
        anilistId = raw.anilistId?.nullIfZero()
    )
}