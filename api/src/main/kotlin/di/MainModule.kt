package xyz.aniways.di

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import org.koin.dsl.module

val mainModule = module {
    single { HttpClient(CIO) }
}