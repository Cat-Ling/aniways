package xyz.aniways.features.auth.dtos

import kotlinx.serialization.Serializable

@Serializable
data class ForgotPasswordDto(
    val email: String
)