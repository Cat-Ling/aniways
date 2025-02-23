package xyz.aniways.features.settings.db

import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.Table
import org.ktorm.schema.boolean
import org.ktorm.schema.varchar

interface Settings : Entity<Settings> {
    var userId: String
    var autoNextEpisode: Boolean
    var autoPlayEpisode: Boolean
    var autoResumeEpisode: Boolean
    var incognitoMode: Boolean

    companion object : Entity.Factory<Settings>()
}

object SettingsTable : Table<Settings>("settings") {
    val userId = varchar("user_id").primaryKey().bindTo { it.userId }
    val autoNextEpisode = boolean("auto_next_episode").bindTo { it.autoNextEpisode }
    val autoPlayEpisode = boolean("auto_play_episode").bindTo { it.autoPlayEpisode }
    val autoResumeEpisode = boolean("auto_resume_episode").bindTo { it.autoResumeEpisode }
    val incognitoMode = boolean("incognito_mode").bindTo { it.incognitoMode }
}

val Database.settings get() = this.sequenceOf(SettingsTable)