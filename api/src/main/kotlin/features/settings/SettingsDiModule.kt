package xyz.aniways.features.settings

import org.koin.dsl.module
import xyz.aniways.features.settings.dao.DBSettingsDao
import xyz.aniways.features.settings.dao.SettingsDao
import xyz.aniways.features.settings.services.SettingsService

val settingsModule = module {
    factory {
        DBSettingsDao(get()) as SettingsDao
    }

    factory {
        SettingsService(get())
    }
}