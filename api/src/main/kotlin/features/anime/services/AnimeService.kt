package xyz.aniways.features.anime.services

import xyz.aniways.features.anime.api.anilist.AnilistApi
import xyz.aniways.features.anime.api.anilist.models.AnilistAnime
import xyz.aniways.features.anime.api.anilist.models.AnilistAnimeDto
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.dtos.AnimeDto
import xyz.aniways.features.anime.dtos.toAnimeDto
import xyz.aniways.features.anime.scrapers.AnimeScraper
import xyz.aniways.models.Pagination

class AnimeService(
    private val animeScraper: AnimeScraper,
    private val animeDao: AnimeDao,
    private val anilistApi: AnilistApi,
) {
    suspend fun getTrendingAnimes(): List<AnimeDto> {
        val anime = anilistApi.getTrendingAnime()

        val dbAnime = animeDao.getAnimesInMalIds(anime.mapNotNull { it.malId })

        return anime.mapNotNull { scrapedAnime ->
            dbAnime
                .find { it.malId == scrapedAnime.malId }
                ?.toAnimeDto()
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

    private suspend fun transformToAnilistAnimeDto(animes: List<AnilistAnime>): List<AnilistAnimeDto> {
        val dbAnimes = animeDao.getAnimesInMalIds(animes.mapNotNull { it.malId })

        return animes.mapNotNull { anilistAnime ->
            val dbAnime = dbAnimes.find { it.malId == anilistAnime.malId }

            dbAnime ?: return@mapNotNull null

            AnilistAnimeDto(
                id = dbAnime.id.toString(),
                title = anilistAnime.title,
                bannerImage = anilistAnime.bannerImage,
                coverImage = anilistAnime.coverImage,
                description = anilistAnime.description,
                startDate = anilistAnime.startDate,
                type = anilistAnime.type,
                episodes = anilistAnime.episodes,
                anime = dbAnime.toAnimeDto(),
            )
        }
    }

    suspend fun getSeasonalAnimes(): List<AnilistAnimeDto> {
        val animes = anilistApi.getSeasonalAnime()

        return transformToAnilistAnimeDto(animes)
    }

    suspend fun getPopularAnimes(): List<AnilistAnimeDto> {
        val anime = anilistApi.getAllTimePopularAnime()

        return transformToAnilistAnimeDto(anime)
    }
}