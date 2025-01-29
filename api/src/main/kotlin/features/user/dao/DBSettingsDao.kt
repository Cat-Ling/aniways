package xyz.aniways.features.user.dao

import org.ktorm.database.Database
import org.ktorm.dsl.eq
import org.ktorm.entity.add
import org.ktorm.entity.find
import org.ktorm.entity.update
import xyz.aniways.features.user.db.SettingsEntity
import xyz.aniways.features.user.db.settings

class DBSettingsDao(
    private val db: Database
): SettingsDao {
    override suspend fun getSettings(userId: Int): SettingsEntity? {
        return db.settings.find { it.userId eq userId }
    }

    override suspend fun updateSettings(settings: SettingsEntity) {
        val entity = db.settings.find { it.userId eq settings.userId }
        entity?.let {
            db.settings.update(settings)
        } ?: run {
            db.settings.add(settings)
        }
    }
}