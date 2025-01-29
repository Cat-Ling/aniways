package xyz.aniways.features.user.db

import org.ktorm.database.Database
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.Table
import org.ktorm.schema.boolean
import org.ktorm.schema.int

object SettingsTable: Table<SettingsEntity>("settings") {
    val userId = int("user_id").primaryKey().bindTo { it.userId }
    val autoNextEpisode = boolean("auto_next_episode").bindTo { it.autoNextEpisode }
    val autoPlayEpisode = boolean("auto_play_episode").bindTo { it.autoPlayEpisode }
    val autoUpdateMal = boolean("auto_update_mal").bindTo { it.autoUpdateMal }
}

val Database.settings get() = this.sequenceOf(SettingsTable)