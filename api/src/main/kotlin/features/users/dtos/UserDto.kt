package xyz.aniways.features.users.dtos

import kotlinx.serialization.Serializable
import xyz.aniways.features.users.db.UserEntity
import java.time.Instant

@Serializable
data class UserDto(
    val id: String,
    val username: String,
    val email: String,
    val profilePicture: String?,
    val createdAt: Long,
    val updatedAt: Long,
)

fun UserDto.toEntity() = UserEntity {
    id = this@toEntity.id
    username = this@toEntity.username
    email = this@toEntity.email
    profilePicture = this@toEntity.profilePicture
    createdAt = Instant.ofEpochMilli(this@toEntity.createdAt)
    updatedAt = Instant.ofEpochMilli(this@toEntity.updatedAt)
}

fun UserEntity.toDto() = UserDto(
    id = this.id,
    username = this.username,
    email = this.email,
    profilePicture = this.profilePicture,
    createdAt = this.createdAt.toEpochMilli(),
    updatedAt = this.updatedAt.toEpochMilli(),
)