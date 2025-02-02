package xyz.aniways.features.anime.dao

import xyz.aniways.features.anime.db.Anime
import xyz.aniways.models.Pagination

interface AnimeDao {
    suspend fun getAnimeCount(): Int
    suspend fun getRecentlyUpdatedAnimes(page: Int, itemsPerPage: Int): Pagination<Anime>

    suspend fun getAnimeById(id: String): Anime?
    suspend fun getAnimesInMalIds(malIds: List<Int>): List<Anime>
    suspend fun getAnimesInHiAnimeIds(hiAnimeIds: List<String>): List<Anime>

    suspend fun insertAnime(anime: Anime): Anime
    suspend fun insertAnimes(animes: List<Anime>)
    suspend fun updateAnime(anime: Anime): Anime
}