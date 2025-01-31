package xyz.aniways.features.anime.scrapers

import xyz.aniways.features.anime.dtos.SearchResultDto
import xyz.aniways.features.anime.dtos.TopAnimeDto
import xyz.aniways.features.anime.dtos.TrendingAnimeDto
import xyz.aniways.models.Pagination

// TODO: Convert all the resulting DTOs to use the AnimeDto based on DB schema
interface AnimeScraper {
    suspend fun getTrendingAnimes(): List<TrendingAnimeDto>
    suspend fun getTopAnimes(): TopAnimeDto
    suspend fun searchAnime(query: String, page: Int): Pagination<SearchResultDto>
}