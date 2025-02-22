package xyz.aniways.features.library.db

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.*
import java.time.Instant

interface LibraryEntity : Entity<LibraryEntity> {
    var id: String
    var animeId: String
    var userId: String
    var watchedEpisodes: Int
    var status: LibraryStatus
    var rating: Int?
    var createdAt: Instant
    var updatedAt: Instant

    companion object : Entity.Factory<LibraryEntity>()
}

@Serializable
enum class LibraryStatus {
    @SerialName("planning")
    PLANNING,
    @SerialName("watching")
    WATCHING,
    @SerialName("completed")
    COMPLETED,
    @SerialName("dropped")
    DROPPED,
    @SerialName("paused")
    PAUSED,

    @SerialName("all")
    ALL // For fetching all library entries regardless of status (only for filtering in routes, not actl in db)
}

object LibraryTable : Table<LibraryEntity>("library") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val animeId = varchar("anime_id").bindTo { it.animeId }
    val userId = varchar("user_id").bindTo { it.userId }
    val watchedEpisodes = int("watched_episodes").bindTo { it.watchedEpisodes }
    val status = enum<LibraryStatus>("status").bindTo { it.status }
    val rating = int("rating").bindTo { it.rating }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
    val updatedAt = timestamp("updated_at").bindTo { it.updatedAt }
}

val Database.library get() = this.sequenceOf(LibraryTable)