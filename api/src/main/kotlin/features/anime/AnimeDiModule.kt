package xyz.aniways.features.anime

import org.koin.dsl.module
import xyz.aniways.features.anime.api.anilist.AnilistApi
import xyz.aniways.features.anime.api.mal.MalApi
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
        HianimeScraper(get()) as AnimeScraper
    }

    factory {
        MalApi(get())
    }

    factory {
        AnilistApi(get())
    }

    factory {
        AnimeService(get(), get(), get())
    }
}