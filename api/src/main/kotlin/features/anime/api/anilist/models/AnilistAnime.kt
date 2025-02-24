package xyz.aniways.features.anime.api.anilist.models

import kotlinx.serialization.Serializable
import xyz.aniways.features.anime.dtos.AnimeDto

@Serializable
data class SeasonalAnimeRequest(
    val year: Int,
    val season: String,
)

@Serializable
data class AnilistAnimeDto(
    val id: String,
    val title: String,
    val bannerImage: String?,
    val coverImage: String,
    val description: String,
    val startDate: Long,
    val type: String?,
    val episodes: Int?,
    val anime: AnimeDto,
)

@Serializable
data class AnilistAnime(
    val anilistId: Int,
    val malId: Int?,
    val title: String,
    val bannerImage: String?,
    val coverImage: String,
    val description: String,
    val startDate: Long,
    val type: String?,
    val episodes: Int?,
)

@Serializable
data class RawTitle(
    val romaji: String,
)

@Serializable
data class RawImage(
    val large: String,
    val extraLarge: String?,
)

@Serializable
data class RawStartDates(
    val year: Int? = null,
    val month: Int? = null,
    val day: Int? = null,
)

@Serializable
data class RawMedia(
    val id: Int,
    val idMal: Int?,
    val title: RawTitle,
    val bannerImage: String?,
    val coverImage: RawImage,
    val description: String,
    val format: String?,
    val episodes: Int?,
    val startDate: RawStartDates,
)

@Serializable
data class RawSeason(
    val media: List<RawMedia>,
)

@Serializable
data class RawData(
    val page: RawSeason,
)

@Serializable
data class RawResponse(
    val data: RawData,
)

@Serializable
data class RawBannerResponse(
    val data: RawBannerData,
)

@Serializable
data class RawBannerData(
    val media: RawMedia,
)