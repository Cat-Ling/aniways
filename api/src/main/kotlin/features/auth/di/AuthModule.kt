package xyz.aniways.features.auth.di

import org.koin.dsl.module
import xyz.aniways.features.auth.services.MalUserService

val authModule = module {
    factory {
        MalUserService(get())
    }
}