package xyz.aniways.features.auth.db

import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.Table
import org.ktorm.schema.timestamp
import org.ktorm.schema.varchar
import java.time.Instant

interface ResetPasswordEntity: Entity<ResetPasswordEntity> {
    var token: String
    var userId: String
    var expiresAt: Instant
    var createdAt: Instant

    companion object : Entity.Factory<ResetPasswordEntity>()
}

object ResetPasswordTable: Table<ResetPasswordEntity>("reset_passwords") {
    val token = varchar("token").primaryKey().bindTo { it.token }
    val userId = varchar("user_id").bindTo { it.userId }
    val expiresAt = timestamp("expires_at").bindTo { it.expiresAt }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
}

val Database.resetPasswords get() = this.sequenceOf(ResetPasswordTable)