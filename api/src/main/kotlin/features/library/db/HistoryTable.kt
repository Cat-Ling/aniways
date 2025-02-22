package xyz.aniways.features.library.db

import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.timestamp
import org.ktorm.schema.varchar
import java.time.Instant

interface HistoryEntity: Entity<HistoryEntity> {
    var id: String
    var animeId: String
    var userId: String
    var watchedEpisodes: Int
    var createdAt: Instant

    companion object: Entity.Factory<HistoryEntity>()
}

object HistoryTable: Table<HistoryEntity>("history") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val animeId = varchar("anime_id").bindTo { it.animeId }
    val userId = varchar("user_id").bindTo { it.userId }
    val watchedEpisodes = int("watched_episodes").bindTo { it.watchedEpisodes }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
}

val Database.history get() = this.sequenceOf(HistoryTable)