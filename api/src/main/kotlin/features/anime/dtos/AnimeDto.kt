package xyz.aniways.features.anime.dtos

import kotlinx.serialization.Serializable
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.db.AnimeMetadata
import java.time.Instant
import java.util.*

@Serializable
data class AnimeDto(
    val id: String,
    val name: String,
    val jname: String,
    val description: String,
    val poster: String,
    val hiAnimeId: String,
    val malId: Int?,
    val anilistId: Int?,
    val lastEpisode: Int?,
    val createdAt: Long,
    val animeMetadata: AnimeMetadataDto?
)

@Serializable
data class AnimeMetadataDto(
    val malId: Int,
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
    val createdAt: Long,
    val lastUpdatedAt: Long
)

fun AnimeDto.toEntity(): Anime {
    return Anime {
        id = UUID.fromString(this@toEntity.id)
        name = this@toEntity.name
        jname = this@toEntity.jname
        description = this@toEntity.description
        poster = this@toEntity.poster
        hiAnimeId = this@toEntity.hiAnimeId
        malId = this@toEntity.malId
        anilistId = this@toEntity.anilistId
        lastEpisode = this@toEntity.lastEpisode
        createdAt = Instant.ofEpochSecond(this@toEntity.createdAt)
        animeMetadata = this@toEntity.animeMetadata?.toEntity()
    }
}

fun AnimeMetadataDto.toEntity(): AnimeMetadata {
    return AnimeMetadata {
        malId = this@toEntity.malId
        mainPicture = this@toEntity.mainPicture
        mediaType = this@toEntity.mediaType
        rating = this@toEntity.rating
        avgEpDuration = this@toEntity.avgEpDuration
        airingStatus = this@toEntity.airingStatus
        totalEpisodes = this@toEntity.totalEpisodes
        studio = this@toEntity.studio
        rank = this@toEntity.rank
        mean = this@toEntity.mean
        scoringUsers = this@toEntity.scoringUsers
        popularity = this@toEntity.popularity
        airingStart = this@toEntity.airingStart
        airingEnd = this@toEntity.airingEnd
        source = this@toEntity.source
        trailer = this@toEntity.trailer
        createdAt = Instant.ofEpochSecond(this@toEntity.createdAt)
        lastUpdatedAt = Instant.ofEpochSecond(this@toEntity.lastUpdatedAt)
    }
}

fun Anime.toDto(): AnimeDto {
    return AnimeDto(
        id = this.id.toString(),
        name = this.name,
        jname = this.jname,
        description = this.description,
        poster = this.poster,
        hiAnimeId = this.hiAnimeId,
        malId = this.malId,
        anilistId = this.anilistId,
        lastEpisode = this.lastEpisode,
        createdAt = this.createdAt.epochSecond,
        animeMetadata = this.animeMetadata?.toDto()
    )
}

fun AnimeMetadata.toDto(): AnimeMetadataDto {
    return AnimeMetadataDto(
        malId = this.malId,
        mainPicture = this.mainPicture,
        mediaType = this.mediaType,
        rating = this.rating,
        avgEpDuration = this.avgEpDuration,
        airingStatus = this.airingStatus,
        totalEpisodes = this.totalEpisodes,
        studio = this.studio,
        rank = this.rank,
        mean = this.mean,
        scoringUsers = this.scoringUsers,
        popularity = this.popularity,
        airingStart = this.airingStart,
        airingEnd = this.airingEnd,
        source = this.source,
        trailer = this.trailer,
        createdAt = this.createdAt.epochSecond,
        lastUpdatedAt = this.lastUpdatedAt.epochSecond
    )
}