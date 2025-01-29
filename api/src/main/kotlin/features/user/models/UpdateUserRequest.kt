package xyz.aniways.features.user.models

data class UpdateUserRequest(
    val id: String,
    val username: String,
    val picture: String?
)
