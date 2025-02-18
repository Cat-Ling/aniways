package xyz.aniways.features.auth

import org.koin.dsl.module
import xyz.aniways.features.auth.daos.DbSessionDao
import xyz.aniways.features.auth.daos.DbTokenDao
import xyz.aniways.features.auth.daos.SessionDao
import xyz.aniways.features.auth.daos.TokenDao
import xyz.aniways.features.auth.services.AuthService
import xyz.aniways.features.auth.services.KtorMalUserService
import xyz.aniways.features.auth.services.MalUserService

val authModule = module {
    factory {
        KtorMalUserService(get()) as MalUserService
    }

    factory {
        DbTokenDao(get()) as TokenDao
    }

    factory {
        DbSessionDao(get()) as SessionDao
    }

    factory {
        AuthService(get(), get())
    }
}