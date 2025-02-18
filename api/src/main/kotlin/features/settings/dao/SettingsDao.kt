package xyz.aniways.features.settings.dao

import xyz.aniways.features.settings.db.Settings

interface SettingsDao {
    suspend fun getSettings(userId: String): Settings
    suspend fun saveSettings(settings: Settings)
}