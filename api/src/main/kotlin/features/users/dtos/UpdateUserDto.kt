package xyz.aniways.features.users.dtos

import kotlinx.serialization.Serializable

@Serializable
data class UpdateUserDto(
    val username: String?,
    val email: String?,
    val password: String?,
    val profilePicture: String?,
)