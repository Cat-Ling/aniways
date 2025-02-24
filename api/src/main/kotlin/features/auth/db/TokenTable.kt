package xyz.aniways.features.auth.db

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.*
import java.time.Instant

interface TokenEntity: Entity<TokenEntity> {
    var id: String
    var userId: String
    var token: String
    var refreshToken: String?
    var provider: Provider
    var expiresAt: Instant?
    var createdAt: Instant

    companion object : Entity.Factory<TokenEntity>()
}


@Serializable
enum class Provider {
    @SerialName("myanimelist")
    MYANIMELIST,

    @SerialName("anilist")
    ANILIST
}

object TokenTable: Table<TokenEntity>("user_tokens") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val userId = varchar("user_id").bindTo { it.userId }
    val token = text("token").bindTo { it.token }
    val refreshToken = text("refresh_token").bindTo { it.refreshToken }
    val provider = enum<Provider>("provider").bindTo { it.provider }
    val expiresAt = timestamp("expires_at").bindTo { it.expiresAt }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
}

val Database.tokens get() = this.sequenceOf(TokenTable)