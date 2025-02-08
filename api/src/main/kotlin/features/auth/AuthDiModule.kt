package xyz.aniways.features.auth

import org.koin.dsl.module
import xyz.aniways.features.auth.services.KtorMalUserService
import xyz.aniways.features.auth.services.MalUserService

val authModule = module {
    factory {
        KtorMalUserService(get()) as MalUserService
    }
}