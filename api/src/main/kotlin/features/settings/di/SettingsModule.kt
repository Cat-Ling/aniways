package xyz.aniways.features.settings.di

import org.koin.dsl.module
import xyz.aniways.features.settings.dao.DBSettingsDao
import xyz.aniways.features.settings.dao.SettingsDao
import xyz.aniways.features.settings.services.SettingsService

val settingsModule = module {
    factory<SettingsDao> { DBSettingsDao(get()) }
    factory { SettingsService(get()) }
}