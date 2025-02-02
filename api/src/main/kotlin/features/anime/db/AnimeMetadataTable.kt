package xyz.aniways.features.anime.db

import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.*
import java.time.Instant

interface AnimeMetadata : Entity<AnimeMetadata> {
    var malId: Int
    var description: String
    var mainPicture: String
    var mediaType: String
    var rating: String?
    var avgEpDuration: Int?
    var airingStatus: String
    var totalEpisodes: Int?
    var studio: String?
    var rank: Int?
    var mean: Double?
    var scoringUsers: Int
    var popularity: Int?
    var airingStart: String?
    var airingEnd: String?
    var source: String?
    var trailer: String?
    var createdAt: Instant
    var lastUpdatedAt: Instant?

    companion object : Entity.Factory<AnimeMetadata>()
}

object AnimeMetadataTable : Table<AnimeMetadata>("anime_metadata") {
    val malId = int("mal_id").primaryKey().bindTo { it.malId }
    val description = varchar("description").bindTo { it.description }
    val mainPicture = varchar("main_picture").bindTo { it.mainPicture }
    val mediaType = varchar("media_type").bindTo { it.mediaType }
    val rating = varchar("rating").bindTo { it.rating }
    val avgEpDuration = int("avg_ep_duration").bindTo { it.avgEpDuration }
    val airingStatus = varchar("airing_status").bindTo { it.airingStatus }
    val totalEpisodes = int("total_episodes").bindTo { it.totalEpisodes }
    val studio = varchar("studio").bindTo { it.studio }
    val rank = int("rank").bindTo { it.rank }
    val mean = double("mean").bindTo { it.mean }
    val scoringUsers = int("scoring_users").bindTo { it.scoringUsers }
    val popularity = int("popularity").bindTo { it.popularity }
    val airingStart = varchar("airing_start").bindTo { it.airingStart }
    val airingEnd = varchar("airing_end").bindTo { it.airingEnd }
    val source = varchar("source").bindTo { it.source }
    val trailer = varchar("trailer").bindTo { it.trailer }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
    val lastUpdatedAt = timestamp("last_updated_at").bindTo { it.lastUpdatedAt }
}

val Database.animeMetadata get() = this.sequenceOf(AnimeMetadataTable)
