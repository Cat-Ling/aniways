package xyz.aniways.features.anime.services

import io.ktor.util.logging.*
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import xyz.aniways.features.anime.api.anilist.AnilistApi
import xyz.aniways.features.anime.api.anilist.models.AnilistAnime
import xyz.aniways.features.anime.api.anilist.models.AnilistAnimeDto
import xyz.aniways.features.anime.api.mal.MalApi
import xyz.aniways.features.anime.api.mal.models.MalAnimeList
import xyz.aniways.features.anime.api.mal.models.MalAnimeMetadata
import xyz.aniways.features.anime.api.mal.models.toAnimeMetadata
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.dtos.*
import xyz.aniways.features.anime.scrapers.AnimeScraper
import xyz.aniways.models.Pagination
import xyz.aniways.utils.retryWithDelay
import java.time.Instant

class AnimeService(
    private val animeScraper: AnimeScraper,
    private val animeDao: AnimeDao,
    private val anilistApi: AnilistApi,
    private val malApi: MalApi,
) {
    private val logger = KtorSimpleLogger("AnimeService")

    private suspend fun saveMetadataInDB(
        anime: Anime,
        malMetadata: MalAnimeMetadata? = null
    ): AnimeWithMetadataDto {
        return anime.metadata?.lastUpdatedAt?.let {
            val monthAgo = Instant.now().toEpochMilli() - 60 * 60 * 24 * 30
            if (it.toEpochMilli() < monthAgo) return@let null

            anime.toAnimeWithMetadataDto()
        } ?: run {
            val metadata = (malMetadata ?: malApi.getAnimeMetadata(anime.malId!!)).toAnimeMetadata()

            val result = anime.metadata?.lastUpdatedAt?.let {
                animeDao.updateAnimeMetadata(metadata)
            } ?: animeDao.insertAnimeMetadata(metadata)

            return anime.copy().apply { this.metadata = result }.toAnimeWithMetadataDto()
        }
    }

    suspend fun getAnimeById(id: String): AnimeWithMetadataDto? {
        val anime = animeDao.getAnimeById(id) ?: return null

        return saveMetadataInDB(anime)
    }

    suspend fun getAnimeTrailer(id: String): String? {
        return animeDao.getAnimeById(id)?.let { anime ->
            anime.malId ?: return@let null
            malApi.getTrailer(anime.malId!!).also { trailer ->
                anime.metadata?.run {
                    if (this.trailer == trailer || trailer == null) return@run
                    animeDao.updateAnimeMetadata(this.copy().apply {
                        this.trailer = trailer
                    })
                }
            }
        }
    }

    suspend fun getTrendingAnimes(): List<AnimeDto> {
        val trendingAnimes = anilistApi.getTrendingAnime()
        val dbAnimes = animeDao.getAnimesInMalIds(trendingAnimes.mapNotNull { it.malId })

        return trendingAnimes.mapNotNull { scrapedAnime ->
            dbAnimes.find { it.malId == scrapedAnime.malId }?.toAnimeDto()
        }
    }

    suspend fun getSeasonalAnimes(): List<AnilistAnimeDto> {
        return transformToAnilistAnimeDto(anilistApi.getSeasonalAnime())
    }

    suspend fun getPopularAnimes(): List<AnilistAnimeDto> {
        return transformToAnilistAnimeDto(anilistApi.getAllTimePopularAnime())
    }

    suspend fun getRecentlyUpdatedAnimes(page: Int, itemsPerPage: Int): Pagination<AnimeDto> {
        val result = animeDao.getRecentlyUpdatedAnimes(page, itemsPerPage)
        return Pagination(result.pageInfo, result.items.map { it.toAnimeDto() })
    }

    suspend fun getEpisodesOfAnime(id: String): List<EpisodeDto> {
        val anime = animeDao.getAnimeById(id) ?: return emptyList()

        return retryWithDelay { animeScraper.getEpisodesOfAnime(anime.hianimeId) } ?: emptyList()
    }

    suspend fun getServersOfEpisode(episodeId: String): List<EpisodeServerDto> {
        return retryWithDelay { animeScraper.getServersOfEpisode(episodeId) } ?: emptyList()
    }

    suspend fun searchAnime(query: String, page: Int): Pagination<AnimeDto> {
        val result = animeScraper.searchAnime(query, page)
        val dbAnimes = animeDao.getAnimesInHiAnimeIds(result.items.map { it.hianimeId })

        return Pagination(result.pageInfo, dbAnimes.map { it.toAnimeDto() })
    }

    suspend fun getAnimeCount(): Int {
        return animeDao.getAnimeCount()
    }

    suspend fun scrapeTopAnimes(): TopAnimeDto {
        return animeScraper.getTopAnimes()
    }

    suspend fun scrapeAndPopulateAnime(page: Int = 1): Unit = coroutineScope {
        logger.info("Scraping and populating anime for page $page")
        val animes = animeScraper.getAZList(page)
        val semaphore = Semaphore(20)

        val deferredAnimeInfo = animes.items.map { anime ->
            async {
                semaphore.withPermit {
                    logger.info("Fetching anime info for ${anime.hianimeId}")
                    val animeInfo = retryWithDelay {
                        animeScraper.getAnimeInfo(anime.hianimeId)
                    }

                    animeInfo ?: return@async null

                    Anime {
                        name = animeInfo.name
                        jname = animeInfo.jname
                        poster = animeInfo.poster
                        genre = animeInfo.genre
                        hianimeId = anime.hianimeId
                        malId = animeInfo.malId
                        anilistId = animeInfo.anilistId
                        lastEpisode = animeInfo.lastEpisode
                    }
                }
            }
        }

        val animeInfo = deferredAnimeInfo.awaitAll().filterNotNull()
        animeDao.insertAnimes(animeInfo)
        logger.info("Inserted ${animeInfo.size} animes")

        if (!animes.pageInfo.hasNextPage) return@coroutineScope

        delay(1000L)
        scrapeAndPopulateAnime(page + 1)
    }

    suspend fun scrapeAndPopulateNewAnime(): Unit = coroutineScope {
        var page = 1
        val newAnimes = mutableListOf<Anime>()

        while (isActive) {
            val animes = animeScraper.getAZList(page)

            val inDB = animeDao.getAnimesInHiAnimeIds(animes.items.map { it.hianimeId })

            animes.items
                .filter { anime -> inDB.none { it.hianimeId == anime.hianimeId } }
                .forEach { scrapedAnime ->
                    val info = retryWithDelay {
                        animeScraper.getAnimeInfo(scrapedAnime.hianimeId)
                    }

                    newAnimes.add(Anime {
                        name = scrapedAnime.name
                        jname = scrapedAnime.jname
                        poster = scrapedAnime.poster
                        genre = info?.genre ?: ""
                        hianimeId = scrapedAnime.hianimeId
                        malId = info?.malId
                        anilistId = info?.anilistId
                        lastEpisode = info?.lastEpisode
                    })
                }

            if (!animes.pageInfo.hasNextPage) break

            page++
            delay(1000L)
        }

        animeDao.insertAnimes(newAnimes)
        logger.info("Inserted ${newAnimes.size} new animes")
    }

    /*
    * Scrapes from behind so page 210, 209, 208, ... 1 etc
    * */
    suspend fun scrapeAndPopulateRecentlyUpdatedAnime(fromPage: Int? = null): Unit = coroutineScope {
        if (fromPage == 0) {
            logger.info("Scraping and populating recently updated anime completed")
            return@coroutineScope
        }

        val page = fromPage ?: animeScraper.getRecentlyUpdatedAnime(1).pageInfo.totalPage

        logger.info("Scraping and populating recently updated anime for page $page")

        val animes = animeScraper.getRecentlyUpdatedAnime(page)

        val inDB = animeDao.getAnimesInHiAnimeIds(animes.items.map { it.hianimeId })

        val currentTime = System.currentTimeMillis()

        val semaphore = Semaphore(20)
        animes.items.reversed().mapIndexed { index, scrapedAnime ->
            val updateTime = currentTime + (index * 20)

            async {
                semaphore.withPermit {
                    val dbAnime = inDB.find { it.hianimeId == scrapedAnime.hianimeId }

                    logger.info("Fetching anime info for ${scrapedAnime.hianimeId}")
                    val info = retryWithDelay {
                        animeScraper.getAnimeInfo(scrapedAnime.hianimeId)
                    }

                    dbAnime?.let {
                        animeDao.updateAnime(dbAnime.copy().apply {
                            poster = scrapedAnime.poster
                            lastEpisode = scrapedAnime.episodes?.toIntOrNull() ?: dbAnime.lastEpisode
                            malId = info?.malId ?: dbAnime.malId
                            anilistId = info?.anilistId ?: dbAnime.anilistId
                            updatedAt = Instant.ofEpochMilli(updateTime)
                        })
                    } ?: run {
                        animeDao.insertAnime(Anime {
                            name = scrapedAnime.name
                            jname = scrapedAnime.jname
                            poster = scrapedAnime.poster
                            genre = info?.genre ?: ""
                            hianimeId = scrapedAnime.hianimeId
                            malId = info?.malId
                            anilistId = info?.anilistId
                            lastEpisode = scrapedAnime.episodes?.toIntOrNull()
                            updatedAt = Instant.ofEpochMilli(updateTime)
                        })
                    }
                }
            }
        }.awaitAll()

        delay(2000L)
        scrapeAndPopulateRecentlyUpdatedAnime(page - 1)
    }

    private suspend fun transformToAnilistAnimeDto(animes: List<AnilistAnime>): List<AnilistAnimeDto> {
        val dbAnimes = animeDao.getAnimesInMalIds(animes.mapNotNull { it.malId })

        return animes.mapNotNull { anilistAnime ->
            dbAnimes.find { it.malId == anilistAnime.malId }?.let { dbAnime ->
                AnilistAnimeDto(
                    id = dbAnime.id.toString(),
                    title = anilistAnime.title,
                    bannerImage = anilistAnime.bannerImage,
                    coverImage = anilistAnime.coverImage,
                    description = anilistAnime.description,
                    startDate = anilistAnime.startDate,
                    type = anilistAnime.type,
                    episodes = anilistAnime.episodes,
                    anime = dbAnime.toAnimeDto()
                )
            }
        }
    }

    suspend fun getUserAnimeList(
        username: String,
        page: Int,
        itemsPerPage: Int,
        token: String?,
        status: String?,
        sort: String?
    ): AnimeListDto = coroutineScope {
        val animelist = malApi.getListOfUserAnimeList(
            username = username,
            page = page,
            itemsPerPage = itemsPerPage,
            token = token,
            status = status,
            sort = sort
        )

        if (animelist.data.isEmpty()) return@coroutineScope AnimeListDto(
            pageInfo = PageInfo(
                hasNextPage = false,
                hasPreviousPage = false,
                currentPage = page,
            ),
            items = emptyList()
        )

        val dbAnimes = animeDao.getAnimesInMalIds(animelist.data.mapNotNull { it.node?.id })

        animelist.data
            .mapNotNull { it.node }
            .mapNotNull { metadata ->
                val dbAnime = dbAnimes.find { it.malId == metadata.id } ?: return@mapNotNull null
                async { saveMetadataInDB(dbAnime, metadata) }
            }
            .awaitAll()
            .let { anime ->
                AnimeListDto(
                    pageInfo = PageInfo(
                        hasNextPage = animelist.paging?.next != null,
                        hasPreviousPage = animelist.paging?.previous != null,
                        currentPage = page,
                    ),
                    items = anime.mapNotNull { a ->
                        val listStatus = animelist.data.find { it.node?.id == a.malId }?.listStatus

                        listStatus ?: return@mapNotNull null

                        AnimeListNode(
                            id = a.id,
                            name = a.name,
                            jname = a.jname,
                            poster = a.poster,
                            totalEpisodes = a.metadata?.totalEpisodes ?: 0,
                            mediaType = a.metadata?.mediaType ?: "Unknown",
                            mean = a.metadata?.mean ?: 0.0,
                            numScoringUsers = a.metadata?.scoringUsers ?: 0,
                            listStatus = listStatus
                        )
                    }
                )
            }
    }

}
