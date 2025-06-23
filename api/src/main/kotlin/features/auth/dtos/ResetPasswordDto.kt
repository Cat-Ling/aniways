package xyz.aniways.features.auth.dtos

import kotlinx.serialization.Serializable

@Serializable
data class ResetPasswordDto(
    val token: String,
    val password: String
)