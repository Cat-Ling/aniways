package xyz.aniways.features.anime.scrapers

import xyz.aniways.features.anime.dtos.*
import xyz.aniways.models.Pagination

interface AnimeScraper {
    suspend fun getTrendingAnimes(): List<ScrapedAnimeDto>
    suspend fun getTopAnimes(): ScrapedTopAnimeDto
    suspend fun searchAnime(query: String, page: Int): Pagination<ScrapedAnimeDto>
    suspend fun getAZList(page: Int): Pagination<ScrapedAnimeDto>
    suspend fun getAnimeInfo(id: String): ScrapedAnimeInfoDto
    suspend fun getRecentlyUpdatedAnime(page: Int): Pagination<ScrapedAnimeDto>
    suspend fun getEpisodesOfAnime(hianimeId: String): List<EpisodeDto>
    suspend fun getServersOfEpisode(episodeId: String): List<EpisodeServerDto>
}