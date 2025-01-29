package xyz.aniways.features.user.db

import org.ktorm.database.Database
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.*

object UserTable: Table<User>("users") {
    val malId = int("mal_id").primaryKey().bindTo { it.malId }
    val username = varchar("username").bindTo { it.username }
    val picture = varchar("picture").bindTo { it.picture }
    val createdAt = datetime("created_at").bindTo { it.createdAt }
}

val Database.users get() = this.sequenceOf(UserTable)
