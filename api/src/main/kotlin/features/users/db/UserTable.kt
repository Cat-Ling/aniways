package xyz.aniways.features.users.db

import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.Table
import org.ktorm.schema.timestamp
import org.ktorm.schema.varchar
import java.time.Instant

interface UserEntity : Entity<UserEntity> {
    var id: String
    var username: String
    var email: String
    var passwordHash: String
    var profilePicture: String?
    var createdAt: Instant
    var updatedAt: Instant

    companion object : Entity.Factory<UserEntity>()
}

object UserTable : Table<UserEntity>("users") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val username = varchar("username").bindTo { it.username }
    val email = varchar("email").bindTo { it.email }
    val passwordHash = varchar("password_hash").bindTo { it.passwordHash }
    val profilePicture = varchar("profile_picture").bindTo { it.profilePicture }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
    val updatedAt = timestamp("updated_at").bindTo { it.updatedAt }
}

val Database.users get() = this.sequenceOf(UserTable)