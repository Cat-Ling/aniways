package xyz.aniways.features.library

import xyz.aniways.features.library.daos.HistoryDao
import xyz.aniways.features.library.daos.LibraryDao
import xyz.aniways.features.library.db.LibraryStatus

class LibraryService(
    private val libraryDao: LibraryDao,
    private val historyDao: HistoryDao
) {
    suspend fun getLibrary(userId: String, status: LibraryStatus, page: Int, itemsPerPage: Int) {
        libraryDao.getLibrary(
            userId = userId,
            status = status,
            page = page,
            itemsPerPage = itemsPerPage
        )
    }

    suspend fun getHistory(userId: String, page: Int, itemsPerPage: Int) {
        historyDao.getHistory(
            userId = userId,
            page = page,
            itemsPerPage = itemsPerPage
        )
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