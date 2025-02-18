package xyz.aniways.features.auth.db

import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.Table
import org.ktorm.schema.text
import org.ktorm.schema.timestamp
import org.ktorm.schema.varchar
import java.time.Instant

interface TokenEntity: Entity<TokenEntity> {
    var id: String
    var userId: String
    var token: String
    var refreshToken: String?
    var provider: String
    var expiresAt: Instant?
    var createdAt: Instant

    companion object : Entity.Factory<TokenEntity>()
}

object TokenTable: Table<TokenEntity>("user_tokens") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val userId = varchar("user_id").bindTo { it.userId }
    val token = text("token").bindTo { it.token }
    val refreshToken = text("refresh_token").bindTo { it.refreshToken }
    val provider = varchar("provider").bindTo { it.provider }
    val expiresAt = timestamp("expires_at").bindTo { it.expiresAt }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
}

val Database.tokens get() = this.sequenceOf(TokenTable)