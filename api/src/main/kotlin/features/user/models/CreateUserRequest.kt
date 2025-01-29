package xyz.aniways.features.user.models

import xyz.aniways.features.user.db.Gender
import java.time.LocalDateTime

data class CreateUserRequest(
    val malId: Int,
    val username: String,
    val picture: String?,
    val gender: Gender,
    val createdAt: LocalDateTime,
)
