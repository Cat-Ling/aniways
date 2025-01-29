package xyz.aniways.features.user.models

data class CreateOrUpdateUserRequest(
    val malId: Int,
    val username: String,
    val picture: String?,
)