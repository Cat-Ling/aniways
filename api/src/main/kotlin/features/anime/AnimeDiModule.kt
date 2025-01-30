package xyz.aniways.features.anime

import org.koin.dsl.module
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.dao.DbAnimeDao

val animeModule = module {
    factory {
        DbAnimeDao(get()) as AnimeDao
    }
}