package xyz.aniways.features.anime.services

import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.dtos.AnimeDto
import xyz.aniways.features.anime.dtos.ScrapedAnimeDto
import xyz.aniways.features.anime.dtos.toAnimeDto
import xyz.aniways.features.anime.scrapers.AnimeScraper
import xyz.aniways.models.Pagination

class AnimeService(
    private val animeScraper: AnimeScraper,
    private val animeDao: AnimeDao
) {
    suspend fun getTrendingAnimes(): List<AnimeDto> {
        val anime = animeScraper.getTrendingAnimes()

        val dbAnime = animeDao.getAnimesInHiAnimeIds(anime.map { it.hianimeId })

        return anime.map { scrapedAnime ->
            dbAnime
                .find { it.hiAnimeId == scrapedAnime.hianimeId }
                ?.toAnimeDto()
                ?: scrapedAnime.toAnimeDto() // should nvr happen tho
        }
    }

    suspend fun getTopAnimes() = animeScraper.getTopAnimes()
    suspend fun searchAnime(query: String, page: Int): Pagination<AnimeDto> {
        val result = animeScraper.searchAnime(query, page)

        val animes = animeDao.getAnimesInHiAnimeIds(result.items.map { it.hianimeId })

        return Pagination(
            pageInfo = result.pageInfo,
            items = animes.map { it.toAnimeDto() }
        )
    }

    suspend fun getAZList(page: Int) = animeScraper.getAZList(page)
    suspend fun getAnimeInfo(id: String) = animeScraper.getAnimeInfo(id)

    suspend fun getAnimeCount() = animeDao.getAnimeCount()
    suspend fun insertAnimes(animes: List<Anime>) = animeDao.insertAnimes(animes)
}