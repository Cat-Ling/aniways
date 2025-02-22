package xyz.aniways.features.library.dtos

import kotlinx.serialization.Serializable
import xyz.aniways.features.anime.dtos.AnimeDto
import xyz.aniways.features.anime.dtos.toAnimeDto
import xyz.aniways.features.library.db.LibraryEntity
import xyz.aniways.features.library.db.LibraryStatus

@Serializable
data class LibraryDto(
    val id: String,
    val animeId: String,
    val userId: String,
    val watchedEpisodes: Int,
    val status: LibraryStatus,
    val createdAt: Long,
    val updatedAt: Long,
    val anime: AnimeDto,
)

fun LibraryEntity.toDto() = LibraryDto(
    id = this.id,
    animeId = this.animeId,
    userId = this.userId,
    watchedEpisodes = this.watchedEpisodes,
    status = this.status,
    createdAt = this.createdAt.toEpochMilli(),
    updatedAt = this.updatedAt.toEpochMilli(),
    anime = this.anime.toAnimeDto()
)