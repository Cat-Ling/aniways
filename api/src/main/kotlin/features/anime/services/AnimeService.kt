package xyz.aniways.features.anime.services

import io.ktor.server.plugins.*
import io.ktor.util.logging.*
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import xyz.aniways.features.anime.api.anilist.AnilistApi
import xyz.aniways.features.anime.api.anilist.models.AnilistAnime
import xyz.aniways.features.anime.api.anilist.models.AnilistAnimeDto
import xyz.aniways.features.anime.api.mal.MalApi
import xyz.aniways.features.anime.api.mal.models.MalAnimeMetadata
import xyz.aniways.features.anime.api.mal.models.toAnimeMetadata
import xyz.aniways.features.anime.api.shikimori.ShikimoriApi
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.dtos.*
import xyz.aniways.features.anime.scrapers.AnimeScraper
import xyz.aniways.models.Pagination
import xyz.aniways.utils.formatGenre
import xyz.aniways.utils.retryWithDelay
import java.time.Instant

class AnimeService(
    private val animeScraper: AnimeScraper,
    private val animeDao: AnimeDao,
    private val anilistApi: AnilistApi,
    private val malApi: MalApi,
    private val shikimoriApi: ShikimoriApi,
) {
    private val logger = KtorSimpleLogger("AnimeService")

    private suspend fun saveMetadataInDB(
        anime: Anime,
        malMetadata: MalAnimeMetadata? = null
    ): AnimeWithMetadataDto {
        return anime.metadata?.lastUpdatedAt?.let {
            val monthAgo = Instant.now().toEpochMilli() - 60 * 60 * 24 * 30
            if (it.toEpochMilli() < monthAgo) {
                // Update metadata in background next request gets the updated metadata
                CoroutineScope(Dispatchers.IO).launch {
                    val metadata = malApi.getAnimeMetadata(anime.malId!!).toAnimeMetadata()
                    animeDao.updateAnimeMetadata(metadata)
                }
            }

            anime.toAnimeWithMetadataDto()
        } ?: run {
            val metadata = (malMetadata ?: malApi.getAnimeMetadata(anime.malId!!)).toAnimeMetadata()

            val result = animeDao.insertAnimeMetadata(metadata)

            return anime.copy().apply { this.metadata = result }.toAnimeWithMetadataDto()
        }
    }

    private suspend fun transformToAnilistAnimeDto(animes: List<AnilistAnime>): List<AnilistAnimeDto> {
        val dbAnimes = animeDao.getAnimesInMalIds(animes.mapNotNull { it.malId })

        return animes.mapNotNull { anilistAnime ->
            dbAnimes.find { it.malId == anilistAnime.malId }?.let { dbAnime ->
                AnilistAnimeDto(
                    id = dbAnime.id,
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

    suspend fun getAnimeById(id: String): AnimeWithMetadataDto {
        val anime = animeDao.getAnimeById(id) ?: throw NotFoundException("Anime not found")

        return saveMetadataInDB(anime)
    }

    suspend fun getAnimeWatchOrder(id: String): List<AnimeWithMetadataDto> {
        val anime = animeDao.getAnimeById(id) ?: return emptyList()
        val malId = anime.malId ?: return listOf(anime.toAnimeWithMetadataDto())
        val franchise = shikimoriApi.getAnimeFranchise(malId)

        val sequels = franchise.links.filter { it.relation == "sequel" }
        val backwardMap = sequels.associateBy { it.targetId }
        val forwardMap = sequels.associateBy { it.sourceId }

        val firstAnime = generateSequence(malId) {
            backwardMap[it]?.sourceId
        }.last()

        val watchOrder = generateSequence(firstAnime) {
            forwardMap[it]?.targetId
        }.toList()

        val dbMap = animeDao.getAnimesInMalIds(watchOrder)
            .associate { it.malId to it.toAnimeWithMetadataDto() }

        return watchOrder.mapNotNull { dbMap[it] }
    }

    suspend fun getRelatedAnime(id: String): List<AnimeWithMetadataDto> {
        val anime = animeDao.getAnimeById(id) ?: return emptyList()
        val malId = anime.malId ?: return emptyList()

        val franchise = shikimoriApi.getAnimeFranchise(malId)
        val watchOrder = getAnimeWatchOrder(anime.id)
            .mapNotNull { it.malId }
            .toSet()

        val relatedAnime = franchise.nodes
            .filter { it.id != malId && it.id !in watchOrder }
            .mapNotNull { it.id }

        if (relatedAnime.isEmpty()) return emptyList()

        val dbAnimes = animeDao.getAnimesInMalIds(relatedAnime)
            .associate { it.malId to it.toAnimeWithMetadataDto() }

        return relatedAnime.mapNotNull { dbAnimes[it] }
    }

    suspend fun getFranchiseOfAnime(id: String): List<AnimeWithMetadataDto> {
        val anime = animeDao.getAnimeById(id) ?: return emptyList()
        val malId = anime.malId ?: return listOf(anime.toAnimeWithMetadataDto())

        val franchise = shikimoriApi.getAnimeFranchise(malId)

        val dbAnimes = animeDao.getAnimesInMalIds(franchise.nodes.mapNotNull { it.id })
            .associate { it.malId to it.toAnimeWithMetadataDto() }

        return franchise.nodes.mapNotNull { dbAnimes[it.id] }
    }

    suspend fun getAnimeTrailer(id: String): String {
        val anime = animeDao.getAnimeById(id)

        val trailer = anime?.metadata?.trailer ?: run {
            if (anime?.malId == null || anime.metadata == null) return@run null
            val trailer = malApi.getTrailer(anime.malId!!) ?: return@run null

            CoroutineScope(Dispatchers.IO).launch {
                anime.metadata!!.trailer = trailer
                anime.metadata!!.flushChanges()
            }

            trailer
        }

        return trailer ?: throw NotFoundException("Trailer not found")
    }

    suspend fun getBannerImage(id: String): String {
        val anime = animeDao.getAnimeById(id)

        val malId = anime?.malId ?: throw NotFoundException("Anime not found")

        try {
            val bannerImage = anilistApi.getBanner(malId).bannerImage
            return bannerImage ?: throw NotFoundException("Banner image not found")
        } catch (e: Exception) {
            throw NotFoundException("Banner image not found")
        }
    }

    suspend fun getTrendingAnimes(): List<AnimeWithMetadataDto> {
        val trendingAnimes = anilistApi.getTrendingAnime()
        val dbAnimes = animeDao.getAnimesInMalIds(trendingAnimes.mapNotNull { it.malId })

        return trendingAnimes.mapNotNull { scrapedAnime ->
            dbAnimes.find { it.malId == scrapedAnime.malId }?.toAnimeWithMetadataDto()
        }
    }

    suspend fun getSeasonalAnimes(): List<AnilistAnimeDto> {
        return transformToAnilistAnimeDto(anilistApi.getSeasonalAnime())
    }

    suspend fun getPopularAnimes(): List<AnimeWithMetadataDto> {
        val popular = anilistApi.getAllTimePopularAnime()
        val dbAnimes = animeDao.getAnimesInMalIds(popular.mapNotNull { it.malId })

        return popular.mapNotNull { anilistAnime ->
            dbAnimes.find { it.malId == anilistAnime.malId }?.toAnimeWithMetadataDto()
        }
    }

    suspend fun getRecentlyUpdatedAnimes(page: Int, itemsPerPage: Int): Pagination<AnimeWithMetadataDto> =
        coroutineScope {
            val result = animeDao.getRecentlyUpdatedAnimes(page, itemsPerPage)

            // Update metadata in background
            launch {
                val semaphore = Semaphore(20)
                result.items.map { anime ->
                    async { semaphore.withPermit { saveMetadataInDB(anime) } }
                }
            }

            Pagination(result.pageInfo, result.items.map { it.toAnimeWithMetadataDto() })
        }

    suspend fun getEpisodesOfAnime(id: String): List<EpisodeDto> {
        val anime = animeDao.getAnimeById(id) ?: return emptyList()

        return retryWithDelay { animeScraper.getEpisodesOfAnime(anime.hianimeId) } ?: emptyList()
    }

    suspend fun getServersOfEpisode(episodeId: String): List<EpisodeServerDto> {
        return retryWithDelay { animeScraper.getServersOfEpisode(episodeId) } ?: emptyList()
    }

    suspend fun searchAnime(
        query: String,
        genre: String?,
        page: Int,
        itemsPerPage: Int = 20
    ): Pagination<AnimeWithMetadataDto> = coroutineScope {
        val result = animeDao.searchAnimes(query, genre?.formatGenre(), page, itemsPerPage)

        // Update metadata in background
        launch {
            val semaphore = Semaphore(20)
            result.items.map { anime ->
                async { semaphore.withPermit { saveMetadataInDB(anime) } }
            }
        }

        Pagination(result.pageInfo, result.items.map { it.toAnimeWithMetadataDto() })
    }

    suspend fun getAnimeCount(): Int {
        return animeDao.getAnimeCount()
    }

    suspend fun getAllGenres(): List<String> {
        return animeDao.getAllGenres()
    }

    suspend fun getAnimesByGenre(genre: String, page: Int, itemsPerPage: Int): Pagination<AnimeWithMetadataDto> =
        coroutineScope {
            val result = animeDao.getAnimesByGenre(
                genre = genre.formatGenre(),
                page = page,
                itemsPerPage = itemsPerPage
            )

            // Update metadata in background
            launch {
                val semaphore = Semaphore(20)
                result.items.map { anime ->
                    async { semaphore.withPermit { saveMetadataInDB(anime) } }
                }
            }

            Pagination(result.pageInfo, result.items.map { it.toAnimeWithMetadataDto() })
        }

    suspend fun getRandomAnime(): AnimeWithMetadataDto {
        val anime = animeDao.getRandomAnime()

        return saveMetadataInDB(anime)
    }

    suspend fun getRandomAnimeByGenre(genre: String): AnimeWithMetadataDto {
        val anime = animeDao.getRandomAnimeByGenre(
            genre = genre.formatGenre()
        )

        return saveMetadataInDB(anime)
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

    suspend fun scrapeAndPopulateRecentlyUpdatedAnime(
        fromPage: Int? = null,
        ids: MutableList<String> = mutableListOf()
    ): List<String> = coroutineScope {
        if (fromPage == 0) {
            logger.info("Scraping and populating recently updated anime completed")
            return@coroutineScope ids.distinct()
        }

        val page = fromPage ?: animeScraper.getRecentlyUpdatedAnime(1).pageInfo.totalPage

        logger.info("Scraping and populating recently updated anime for page $page")

        val animes = animeScraper.getRecentlyUpdatedAnime(page)

        val inDB = animeDao.getAnimesInHiAnimeIds(animes.items.map { it.hianimeId })

        val currentTime = System.currentTimeMillis()

        val semaphore = Semaphore(20)
        animes.items.reversed().filter {
            inDB.none { dbAnime -> dbAnime.hianimeId == it.hianimeId && dbAnime.lastEpisode == it.episodes?.toIntOrNull() }
        }.mapIndexed { index, scrapedAnime ->
            val updateTime = currentTime + (index * 20)

            async {
                semaphore.withPermit {
                    val dbAnime = inDB.find { it.hianimeId == scrapedAnime.hianimeId }

                    logger.info("Fetching anime info for ${scrapedAnime.hianimeId}")
                    val info = retryWithDelay {
                        animeScraper.getAnimeInfo(scrapedAnime.hianimeId)
                    }

                    dbAnime?.let {
                        ids.add(it.id)
                        animeDao.updateAnime(dbAnime.copy().apply {
                            poster = scrapedAnime.poster
                            lastEpisode = scrapedAnime.episodes?.toIntOrNull() ?: dbAnime.lastEpisode
                            malId = info?.malId ?: dbAnime.malId
                            anilistId = info?.anilistId ?: dbAnime.anilistId
                            updatedAt = Instant.ofEpochMilli(updateTime)
                        })
                    } ?: run {
                        val anime = Anime {
                            name = scrapedAnime.name
                            jname = scrapedAnime.jname
                            poster = scrapedAnime.poster
                            genre = info?.genre ?: ""
                            hianimeId = scrapedAnime.hianimeId
                            malId = info?.malId
                            anilistId = info?.anilistId
                            lastEpisode = scrapedAnime.episodes?.toIntOrNull()
                            updatedAt = Instant.ofEpochMilli(updateTime)
                        }
                        animeDao.insertAnime(anime)
                        ids.add(anime.id)
                    }
                }
            }
        }.awaitAll()

        delay(2000L)
        scrapeAndPopulateRecentlyUpdatedAnime(page - 1, ids)
    }
}