package xyz.aniways.features.auth.services

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*

class KtorMalUserService(
    private val httpClient: HttpClient,
) : MalUserService {
    override suspend fun getUserInfo(accessToken: String): MalUser {
        val response = httpClient.get("https://api.myanimelist.net/v2/users/@me") {
            headers {
                header("Authorization", "Bearer $accessToken")
            }
        }

        return response.body<MalUser>()
    }
}