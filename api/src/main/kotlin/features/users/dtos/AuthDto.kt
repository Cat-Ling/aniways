package xyz.aniways.features.users.dtos

import kotlinx.serialization.Serializable

@Serializable
class AuthDto(
    val email: String,
    val password: String,
)