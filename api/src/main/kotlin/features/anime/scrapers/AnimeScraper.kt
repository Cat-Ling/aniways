package xyz.aniways.features.anime.scrapers

import xyz.aniways.features.anime.dtos.ScrapedAnimeDto
import xyz.aniways.features.anime.dtos.ScrapedAnimeInfoDto
import xyz.aniways.features.anime.dtos.SyncData
import xyz.aniways.features.anime.dtos.TopAnimeDto
import xyz.aniways.models.Pagination

// TODO: Convert all the resulting DTOs to use the AnimeDto based on DB schema
interface AnimeScraper {
    suspend fun getTrendingAnimes(): List<ScrapedAnimeDto>
    suspend fun getTopAnimes(): TopAnimeDto
    suspend fun searchAnime(query: String, page: Int): Pagination<ScrapedAnimeDto>
    suspend fun getAZList(page: Int): Pagination<ScrapedAnimeDto>
    suspend fun getSyncData(id: String): SyncData
    suspend fun getAnimeInfo(id: String): ScrapedAnimeInfoDto
}