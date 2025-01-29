package xyz.aniways.features.user.models

import java.time.LocalDateTime

data class CreateUserRequest(
    val malId: Int,
    val username: String,
    val picture: String?,
    val createdAt: LocalDateTime,
)

data class UpdateUserRequest(
    val malId: Int,
    val username: String,
    val picture: String?
)
