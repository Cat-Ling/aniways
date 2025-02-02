package xyz.aniways.features.anime.dao

import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.db.AnimeMetadata
import xyz.aniways.models.Pagination

interface AnimeDao {
    suspend fun getAnimeCount(): Int
    suspend fun getAllGenres(): List<String>

    suspend fun getRecentlyUpdatedAnimes(page: Int, itemsPerPage: Int): Pagination<Anime>
    suspend fun getAnimesByGenre(genre: String, page: Int, itemsPerPage: Int): Pagination<Anime>

    suspend fun getRandomAnime(): Anime
    suspend fun getRandomAnimeByGenre(genre: String): Anime

    suspend fun getAnimeById(id: String): Anime?
    suspend fun getAnimesInMalIds(malIds: List<Int>): List<Anime>
    suspend fun getAnimesInHiAnimeIds(hiAnimeIds: List<String>): List<Anime>

    suspend fun insertAnime(anime: Anime): Anime
    suspend fun insertAnimeMetadata(animeMetadata: AnimeMetadata): AnimeMetadata
    suspend fun insertAnimes(animes: List<Anime>)
    suspend fun updateAnime(anime: Anime): Anime
    suspend fun updateAnimeMetadata(animeMetadata: AnimeMetadata): AnimeMetadata
}