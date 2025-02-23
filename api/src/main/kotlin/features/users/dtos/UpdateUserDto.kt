package xyz.aniways.features.users.dtos

import kotlinx.serialization.Serializable

@Serializable
data class UpdateUserDto(
    val username: String? = null,
    val email: String? = null,
    val password: String? = null,
    val profilePicture: String? = null,
)

@Serializable
data class UpdatePasswordDto(
    val oldPassword: String,
    val newPassword: String,
)