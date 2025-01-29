package xyz.aniways.features.user.db

import org.ktorm.entity.Entity

interface SettingsEntity: Entity<SettingsEntity> {
    var userId: Int
    var autoNextEpisode: Boolean
    var autoPlayEpisode: Boolean
    var autoUpdateMal: Boolean

    companion object: Entity.Factory<SettingsEntity>()
}