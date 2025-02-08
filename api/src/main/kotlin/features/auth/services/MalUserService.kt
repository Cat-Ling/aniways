package xyz.aniways.features.auth.services

import kotlinx.serialization.Serializable

@Serializable
data class MalUser(
    val id: Int,
    val name: String,
    val picture: String,
)

interface MalUserService {
    suspend fun getUserInfo(accessToken: String): MalUser
}