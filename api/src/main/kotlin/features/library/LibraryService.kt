package xyz.aniways.features.library

import io.ktor.server.auth.*
import io.ktor.server.plugins.*
import xyz.aniways.features.library.daos.HistoryDao
import xyz.aniways.features.library.daos.LibraryDao
import xyz.aniways.features.library.db.LibraryStatus
import xyz.aniways.features.library.dtos.HistoryDto
import xyz.aniways.features.library.dtos.LibraryDto
import xyz.aniways.features.library.dtos.toDto
import xyz.aniways.features.settings.services.SettingsService
import xyz.aniways.models.Pagination

class LibraryService(
    private val libraryDao: LibraryDao,
    private val historyDao: HistoryDao,
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
}