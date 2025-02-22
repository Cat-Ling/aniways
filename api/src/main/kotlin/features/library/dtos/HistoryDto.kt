package xyz.aniways.features.library.dtos

import kotlinx.serialization.Serializable
import xyz.aniways.features.anime.dtos.AnimeDto
import xyz.aniways.features.anime.dtos.toAnimeDto
import xyz.aniways.features.library.db.HistoryEntity

@Serializable
data class HistoryDto(
    val id: String,
    val animeId: String,
    val userId: String,
    val watchedEpisodes: Int,
    val createdAt: Long,
    val anime: AnimeDto,
)

fun HistoryEntity.toDto() = HistoryDto(
    id = this.id,
    animeId = this.animeId,
    userId = this.userId,
    watchedEpisodes = this.watchedEpisodes,
    createdAt = this.createdAt.toEpochMilli(),
    anime = this.anime.toAnimeDto()
)