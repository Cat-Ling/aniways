package xyz.aniways.features.anime.services

import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.scrapers.AnimeScraper

class AnimeService(
    private val animeScraper: AnimeScraper,
    private val animeDao: AnimeDao
) {
    suspend fun getTrendingAnimes() = animeScraper.getTrendingAnimes()
}