package xyz.aniways.features.anime.scrapers

import xyz.aniways.features.anime.dtos.TrendingAnimeDto

interface AnimeScraper {
    suspend fun getTrendingAnimes(): List<TrendingAnimeDto>
}