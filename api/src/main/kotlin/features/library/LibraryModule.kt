package xyz.aniways.features.library

import org.koin.dsl.module
import xyz.aniways.features.library.daos.DBHistoryDao
import xyz.aniways.features.library.daos.DBLibraryDao
import xyz.aniways.features.library.daos.HistoryDao
import xyz.aniways.features.library.daos.LibraryDao

val libraryModule = module {
    factory {
        DBLibraryDao(get()) as LibraryDao
    }

    factory {
        DBHistoryDao(get()) as HistoryDao
    }

    factory {
        LibraryService(get(), get())
    }
}