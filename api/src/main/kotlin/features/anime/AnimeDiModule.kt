package xyz.aniways.features.anime

import org.koin.dsl.module
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.dao.DbAnimeDao
import xyz.aniways.features.anime.scrapers.AnimeScraper
import xyz.aniways.features.anime.scrapers.HianimeScraper
import xyz.aniways.features.anime.services.AnimeService

val animeModule = module {
    factory {
        DbAnimeDao(get()) as AnimeDao
    }

    factory {
        HianimeScraper(get(), get()) as AnimeScraper
    }

    factory {
        AnimeService(get(), get())
    }
}