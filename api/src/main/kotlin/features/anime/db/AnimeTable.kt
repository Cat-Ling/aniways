package xyz.aniways.features.anime.db

import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.*
import java.time.Instant
import java.util.*

interface Anime : Entity<Anime> {
    var id: UUID
    var name: String
    var jname: String
    var poster: String
    var genre: String
    var hiAnimeId: String
    var malId: Int?
    var anilistId: Int?
    var lastEpisode: Int?
    var createdAt: Instant
    var animeMetadata: AnimeMetadata?

    companion object : Entity.Factory<Anime>()
}

object AnimeTable : Table<Anime>("animes") {
    val id = uuid("id").primaryKey().bindTo { it.id }
    val name = varchar("name").bindTo { it.name }
    val jname = varchar("jname").bindTo { it.jname }
    val poster = varchar("poster").bindTo { it.poster }
    val genre = varchar("genre").bindTo { it.genre }
    val hiAnimeId = varchar("hi_anime_id").bindTo { it.hiAnimeId }
    val malId = int("mal_id").bindTo { it.malId }.references(AnimeMetadataTable) { it.animeMetadata }
    val anilistId = int("anilist_id").bindTo { it.anilistId }
    val lastEpisode = int("last_episode").bindTo { it.lastEpisode }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
}

val Database.animes get() = this.sequenceOf(AnimeTable)
