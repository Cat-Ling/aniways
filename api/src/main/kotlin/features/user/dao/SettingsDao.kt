package xyz.aniways.features.user.dao

import xyz.aniways.features.user.db.SettingsEntity

interface SettingsDao {
    suspend fun getSettings(userId: Int): SettingsEntity?
    suspend fun updateSettings(settings: SettingsEntity)
}