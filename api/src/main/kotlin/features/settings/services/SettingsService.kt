package xyz.aniways.features.settings.services

import xyz.aniways.features.settings.dao.SettingsDao
import xyz.aniways.features.settings.db.Settings

class SettingsService(
    private val settingsDao: SettingsDao,
) {
    suspend fun getSettingsByUserId(userId: Int) = settingsDao.getSettings(userId)

    suspend fun saveSettings(settings: Settings) {
        settingsDao.saveSettings(settings)
    }
}