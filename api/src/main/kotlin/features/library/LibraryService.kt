package xyz.aniways.features.library

import io.ktor.server.plugins.*
import kotlinx.coroutines.*
import xyz.aniways.features.anime.api.mal.MalApi
import xyz.aniways.features.anime.api.mal.models.Data
import xyz.aniways.features.anime.api.mal.models.MalStatus
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.auth.daos.TokenDao
import xyz.aniways.features.auth.db.Provider
import xyz.aniways.features.library.daos.HistoryDao
import xyz.aniways.features.library.daos.LibraryDao
import xyz.aniways.features.library.daos.SyncLibraryDao
import xyz.aniways.features.library.db.LibraryStatus
import xyz.aniways.features.library.db.SyncStatus
import xyz.aniways.features.library.dtos.HistoryDto
import xyz.aniways.features.library.dtos.LibraryDto
import xyz.aniways.features.library.dtos.toDto
import xyz.aniways.features.settings.services.SettingsService
import xyz.aniways.models.PageInfo
import xyz.aniways.models.Pagination
import java.time.Instant

class LibraryService(
    private val libraryDao: LibraryDao,
    private val historyDao: HistoryDao,
    private val syncLibraryDao: SyncLibraryDao,
    private val malApi: MalApi,
    private val tokenDao: TokenDao,
    private val animeDao: AnimeDao,
    private val settingsService: SettingsService,
) {
    suspend fun getLibraryAnime(
        userId: String,
        animeId: String,
    ): LibraryDto {
        val result = libraryDao.getLibraryAnime(
            userId = userId,
            animeId = animeId
        )

        result ?: throw NotFoundException("Anime not found in library")

        return result.toDto()
    }

    suspend fun getLibrary(
        userId: String,
        status: LibraryStatus,
        page: Int,
        itemsPerPage: Int
    ): Pagination<LibraryDto> {
        val result = libraryDao.getLibrary(
            userId = userId,
            status = status,
            page = page,
            itemsPerPage = itemsPerPage
        )

        return Pagination(
            pageInfo = result.pageInfo,
            items = result.items.map { it.toDto() }
        )
    }

    suspend fun getHistoryAnime(
        userId: String,
        animeId: String,
    ): HistoryDto {
        val result = historyDao.getHistoryAnime(
            userId = userId,
            animeId = animeId
        )

        result ?: throw NotFoundException("Anime not found in history")

        return result.toDto()
    }

    suspend fun getHistory(userId: String, page: Int, itemsPerPage: Int): Pagination<HistoryDto> {
        val result = historyDao.getHistory(
            userId = userId,
            page = page,
            itemsPerPage = itemsPerPage
        )

        return Pagination(
            pageInfo = result.pageInfo,
            items = result.items.map { it.toDto() }
        )
    }

    suspend fun saveToLibrary(userId: String, animeId: String, status: LibraryStatus, watchedEpisodes: Int) {
        val settings = settingsService.getSettingsByUserId(userId)
        if (settings.incognitoMode) return

        // run sync in background cos it's a long running task
        CoroutineScope(Dispatchers.IO).launch {
            val anime = animeDao.getAnimeById(animeId) ?: throw NotFoundException("Anime not found")
            val installedTokens = tokenDao.getInstalledProviders(userId)

            for (token in installedTokens) {
                val tokenEntity = tokenDao.getToken(userId, token) ?: continue
                when (tokenEntity.provider) {
                    Provider.MYANIMELIST -> {
                        anime.malId ?: continue
                        malApi.updateAnimeListEntry(
                            id = anime.malId!!,
                            status = when (status) {
                                LibraryStatus.PLANNING -> MalStatus.PLAN_TO_WATCH
                                LibraryStatus.WATCHING -> MalStatus.WATCHING
                                LibraryStatus.COMPLETED -> MalStatus.COMPLETED
                                LibraryStatus.DROPPED -> MalStatus.DROPPED
                                LibraryStatus.PAUSED -> MalStatus.ON_HOLD
                                LibraryStatus.ALL -> throw IllegalArgumentException("Invalid status")
                            },
                            token = tokenEntity.token,
                            score = 0,
                            numWatchedEpisodes = watchedEpisodes
                        )
                    }

                    Provider.ANILIST -> throw NotImplementedError("Anilist sync is not implemented yet")
                }
            }
        }

        libraryDao.saveToLibrary(
            userId = userId,
            animeId = animeId,
            status = status,
            epNo = watchedEpisodes,
        )
    }

    suspend fun saveToHistory(userId: String, animeId: String, epNo: Int) {
        val settings = settingsService.getSettingsByUserId(userId)
        println(settings)
        if (settings.incognitoMode) return

        historyDao.saveToHistory(
            userId = userId,
            animeId = animeId,
            watchedEpisodes = epNo
        )
    }

    suspend fun deleteFromLibrary(userId: String, animeId: String) {
        libraryDao.deleteFromLibrary(
            userId = userId,
            animeId = animeId
        )
    }

    suspend fun deleteFromHistory(userId: String, animeId: String) {
        historyDao.deleteFromHistory(
            userId = userId,
            animeId = animeId
        )
    }

    private suspend fun syncMAL(userId: String, token: String) = coroutineScope {
        var page = 1
        val listItems = mutableListOf<Data>()
        var hasNextPage = true

        while (hasNextPage) {
            val nextPage = malApi.getListOfUserAnimeList(
                username = "@me",
                page = page,
                itemsPerPage = 750,
                token = token,
                status = null,
                sort = null
            )
            listItems.addAll(nextPage.data)
            hasNextPage = nextPage.paging?.next != null
            page++
            delay(2000L)
        }

        val animes = animeDao.getAnimesInMalIds(malIds = listItems.mapNotNull { it.node?.id })

        val deferred = listItems.map { a ->
            async {
                val anime = animes.find { it.malId == a.node?.id } ?: return@async

                val status = a.listStatus?.status?.let {
                    LibraryStatus.fromMalStatus(it)
                } ?: LibraryStatus.PLANNING

                val updatedAt = try {
                    a.listStatus?.updatedAt?.let { Instant.parse(it) }
                } catch (e: Exception) {
                    null
                }

                libraryDao.saveToLibrary(
                    userId = userId,
                    animeId = anime.id,
                    status = status,
                    epNo = a.listStatus?.numEpisodesWatched ?: 0,
                    updatedAt = updatedAt
                )
            }
        }

        deferred.awaitAll()
    }

    private suspend fun syncLibrary(userId: String, provider: Provider, syncId: String) = coroutineScope {
        try {
            val token = tokenDao.getToken(userId, provider)?.token ?: throw IllegalStateException("Token not found")

            when (provider) {
                Provider.MYANIMELIST -> syncMAL(userId, token)
                Provider.ANILIST -> throw NotImplementedError("Anilist sync is not implemented yet")
            }

            syncLibraryDao.updateSyncLibrary(syncId, SyncStatus.COMPLETED)
        } catch (e: Exception) {
            syncLibraryDao.updateSyncLibrary(syncId, SyncStatus.FAILED)
        }
    }

    suspend fun startSyncingLibrary(userId: String, provider: Provider): String {
        val syncId = syncLibraryDao.insertSyncLibrary(userId, provider)

        // run syncLibrary in background cos it's a long running task
        val scope = CoroutineScope(Dispatchers.IO)
        scope.launch { syncLibrary(userId, provider, syncId) }

        return syncId
    }

    suspend fun getRunningSyncs(userId: String): List<String> {
        val syncs = syncLibraryDao.getRunningSyncsOfUser(userId)
        return syncs.map { it.id }
    }

    suspend fun getSyncStatus(syncId: String): SyncStatus {
        val sync = syncLibraryDao.getSyncLibrary(syncId) ?: throw NotFoundException("Sync not found")
        return sync.syncStatus
    }

    suspend fun deleteAllFromLibrary(userId: String) {
        libraryDao.deleteAllFromLibrary(userId)
    }

    private suspend fun getContinueWatchingLibrary(
        status: LibraryStatus,
        userId: String,
        page: Int,
        itemsPerPage: Int
    ): Pagination<LibraryDto> {
        val watchingAnime = libraryDao.getLibrary(
            userId = userId,
            status = status,
            itemsPerPage = itemsPerPage,
            page = page,
        )

        var currentPage = page + 1
        val result = watchingAnime.items.toMutableList()

        while (true) {
            val nextPage = libraryDao.getLibrary(
                userId = userId,
                status = status,
                itemsPerPage = itemsPerPage,
                page = currentPage,
            )

            if (nextPage.items.isEmpty()) break

            result.addAll(nextPage.items)
            currentPage++
        }

        val continueWatchingAnime = result
            .filter { library -> library.anime.lastEpisode?.let { it > library.watchedEpisodes } ?: false }
            .sortedByDescending { it.updatedAt }
            .map { library -> library.toDto() }

        val totalCount = continueWatchingAnime.size
        val totalPage = totalCount / itemsPerPage + 1
        val hasNextPage = totalCount > page * itemsPerPage
        val hasPreviousPage = page > 1

        val items = continueWatchingAnime
            .drop((page - 1) * itemsPerPage)
            .take(itemsPerPage)

        return Pagination(
            pageInfo = PageInfo(
                totalPage = totalPage,
                currentPage = page,
                hasNextPage = hasNextPage,
                hasPreviousPage = hasPreviousPage
            ),
            items = items
        )
    }

    suspend fun getContinueWatchingAnime(userId: String, page: Int, itemsPerPage: Int): Pagination<LibraryDto> {
        return getContinueWatchingLibrary(LibraryStatus.WATCHING, userId, page, itemsPerPage)
    }

    suspend fun getPlanToWatchAnime(userId: String, page: Int, itemsPerPage: Int): Pagination<LibraryDto> {
        return getContinueWatchingLibrary(LibraryStatus.PLANNING, userId, page, itemsPerPage)
    }
}