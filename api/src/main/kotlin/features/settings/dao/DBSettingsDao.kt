package xyz.aniways.features.settings.dao

import org.ktorm.dsl.eq
import org.ktorm.entity.add
import org.ktorm.entity.find
import org.ktorm.entity.update
import xyz.aniways.database.AniwaysDB
import xyz.aniways.features.settings.db.Settings
import xyz.aniways.features.settings.db.settings

class DBSettingsDao(
    private val db: AniwaysDB
) : SettingsDao {
    override suspend fun getSettings(userId: Int): Settings {
        return db.query {
            settings.find { it.userId eq userId } ?: Settings {
                this.userId = userId
            }.run {
                settings.add(this)
                this
            }
        }
    }

    override suspend fun saveSettings(settings: Settings) {
        return db.query {
            val entity = this.settings.find { it.userId eq settings.userId }
            entity?.let {
                this.settings.update(settings)
            } ?: run {
                this.settings.add(settings)
            }
        }
    }
}