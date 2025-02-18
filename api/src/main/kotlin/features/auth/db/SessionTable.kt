package xyz.aniways.features.auth.db

import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.Table
import org.ktorm.schema.timestamp
import org.ktorm.schema.varchar
import java.time.Instant

interface SessionEntity: Entity<SessionEntity> {
    var id: String
    var userId: String
    var createdAt: Instant
    var expiresAt: Instant

    companion object : Entity.Factory<SessionEntity>()
}

object SessionTable: Table<SessionEntity>("sessions") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val userId = varchar("user_id").bindTo { it.userId }
    val expiresAt = timestamp("expires_at").bindTo { it.expiresAt }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
}

val Database.sessions get() = this.sequenceOf(SessionTable)