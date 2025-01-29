package xyz.aniways.features.user.db

import org.ktorm.entity.Entity
import java.time.LocalDateTime

interface UserEntity: Entity<UserEntity> {
    var malId: Int
    var username: String
    var picture: String?
    val createdAt: LocalDateTime

    companion object: Entity.Factory<UserEntity>()
}
