package xyz.aniways.features.user.db

import org.ktorm.entity.Entity

interface Settings: Entity<Settings> {
    var userId: Int
    var autoNextEpisode: Boolean
    var autoPlayEpisode: Boolean
    var autoUpdateMal: Boolean

    companion object: Entity.Factory<Settings>()
}