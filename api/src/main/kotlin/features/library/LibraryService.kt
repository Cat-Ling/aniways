package xyz.aniways.features.library

import xyz.aniways.features.library.daos.HistoryDao
import xyz.aniways.features.library.daos.LibraryDao
import xyz.aniways.features.library.db.LibraryStatus
import xyz.aniways.features.library.dtos.HistoryDto
import xyz.aniways.features.library.dtos.LibraryDto
import xyz.aniways.features.library.dtos.toDto
import xyz.aniways.models.PageInfo
import xyz.aniways.models.Pagination

class LibraryService(
    private val libraryDao: LibraryDao,
    private val historyDao: HistoryDao
) {
    suspend fun getLibrary(userId: String, status: LibraryStatus, page: Int, itemsPerPage: Int): List<LibraryDto> {
        val items = libraryDao.getLibrary(
            userId = userId,
            status = status,
            page = page,
            itemsPerPage = itemsPerPage
        )

        return items.map { it.toDto() }
    }

    suspend fun getHistory(userId: String, page: Int, itemsPerPage: Int): List<HistoryDto> {
        val items = historyDao.getHistory(
            userId = userId,
            page = page,
            itemsPerPage = itemsPerPage
        )

        return items.map { it.toDto() }
    }

    suspend fun saveToLibrary(userId: String, animeId: String, status: LibraryStatus, watchedEpisodes: Int) {
        libraryDao.saveToLibrary(
            userId = userId,
            animeId = animeId,
            status = status,
            epNo = watchedEpisodes,
        )
    }

    suspend fun saveToHistory(userId: String, animeId: String, epNo: Int) {
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