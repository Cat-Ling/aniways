package xyz.aniways.features.library

import org.koin.dsl.module
import xyz.aniways.features.library.daos.*

val libraryModule = module {
    factory {
        DBLibraryDao(get()) as LibraryDao
    }

    factory {
        DBHistoryDao(get()) as HistoryDao
    }

    factory {
        DBSyncLibraryDao(get()) as SyncLibraryDao
    }

    factory {
        LibraryService(
            libraryDao = get(),
            historyDao = get(),
            syncLibraryDao = get(),
            malApi = get(),
            settingsService = get(),
            tokenDao = get(),
            animeDao = get()
        )
    }
}