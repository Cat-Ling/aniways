package xyz.aniways.features.user.db

import org.ktorm.database.Database
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.*

enum class Gender {
    Male,
    Female,
    NotSpecified
}

object UserTable: Table<UserEntity>("users") {
    val id = uuid("id").primaryKey().bindTo { it.id }
    val malId = int("mal_id").bindTo { it.malId }
    val username = varchar("username").bindTo { it.username }
    val picture = varchar("picture").bindTo { it.picture }
    val gender = enum<Gender>("gender").bindTo { it.gender }
    val createdAt = datetime("created_at").bindTo { it.createdAt }
}

val Database.users get() = this.sequenceOf(UserTable)
