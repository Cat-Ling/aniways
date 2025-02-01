package xyz.aniways.features.anime.services

import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.scrapers.AnimeScraper

class AnimeService(
    private val animeScraper: AnimeScraper,
    private val animeDao: AnimeDao
) {
    suspend fun getTrendingAnimes() = animeScraper.getTrendingAnimes()
    suspend fun getTopAnimes() = animeScraper.getTopAnimes()
    suspend fun searchAnime(query: String, page: Int) = animeScraper.searchAnime(query, page)
    suspend fun getAZList(page: Int) = animeScraper.getAZList(page)
    suspend fun getSyncData(id: String) = animeScraper.getSyncData(id)
    suspend fun getAnimeInfo(id: String) = animeScraper.getAnimeInfo(id)

    suspend fun getAnimeCount() = animeDao.getAnimeCount()
    suspend fun insertAnimes(animes: List<Anime>) = animeDao.insertAnimes(animes)
}