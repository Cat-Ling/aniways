package xyz.aniways.features.user.dao

import xyz.aniways.features.user.db.Settings

interface SettingsDao {
    suspend fun getSettings(userId: Int): Settings?
    suspend fun saveSettings(settings: Settings)
}