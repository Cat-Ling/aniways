package xyz.aniways.features.user.db

import org.ktorm.entity.Entity
import java.time.LocalDateTime

interface User: Entity<User> {
    var malId: Int
    var username: String
    var picture: String?
    val createdAt: LocalDateTime

    companion object: Entity.Factory<User>()
}
