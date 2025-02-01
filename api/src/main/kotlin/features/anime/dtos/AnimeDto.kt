package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.db.AnimeMetadata

@Serializable
data class AnimeDto(
    val id: String,
    val name: String,
    val jname: String,
    val poster: String,
    val genre: List<String>,
    val malId: Int?,
    val anilistId: Int?,
    val lastEpisode: Int?,
)

@Serializable
data class AnimeWithMetadataDto(
    val anime: AnimeDto,
    val metadata: AnimeMetadataDto?,
)

@Serializable
data class AnimeMetadataDto(
    val malId: Int,
    val description: String,
    val mainPicture: String,
    val mediaType: String,
    val rating: String?,
    val avgEpDuration: Int?,
    val airingStatus: String,
    val totalEpisodes: Int?,
    val studio: String?,
    val rank: Int?,
    val mean: Int?,
    val scoringUsers: Int,
    val popularity: Int?,
    val airingStart: String?,
    val airingEnd: String?,
    val source: String?,
    val trailer: String?,
)

fun Anime.toAnimeDto() = AnimeDto(
    id = id.toString(),
    name = name,
    jname = jname,
    poster = poster,
    genre = genre.split(", "),
    malId = malId,
    anilistId = anilistId,
    lastEpisode = lastEpisode,
)

fun ScrapedAnimeDto.toAnimeDto() = AnimeDto(
    id = hianimeId,
    name = name,
    jname = jname,
    poster = poster,
    genre = emptyList(),
    malId = null,
    anilistId = null,
    lastEpisode = null,
)

fun AnimeMetadata.toAnimeMetadataDto() = AnimeMetadataDto(
    malId = malId,
    description = description,
    mainPicture = mainPicture,
    mediaType = mediaType,
    rating = rating,
    avgEpDuration = avgEpDuration,
    airingStatus = airingStatus,
    totalEpisodes = totalEpisodes,
    studio = studio,
    rank = rank,
    mean = mean,
    scoringUsers = scoringUsers,
    popularity = popularity,
    airingStart = airingStart,
    airingEnd = airingEnd,
    source = source,
    trailer = trailer,
)

fun Anime.toAnimeWithMetadataDto() = AnimeWithMetadataDto(
    anime = toAnimeDto(),
    metadata = metadata?.toAnimeMetadataDto(),
)
