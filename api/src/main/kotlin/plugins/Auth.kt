package xyz.aniways.plugins

import io.ktor.client.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import org.koin.ktor.ext.inject
import xyz.aniways.env
import xyz.aniways.features.auth.oauth.MalOauthProvider
import xyz.aniways.features.auth.services.AuthService

object Auth {
    const val MAL_OAUTH = "mal-oauth"

    class UserSession(
        val sessionId: String,
        val userId: String,
    )
}

fun Application.configureAuth() {
    val httpClient by inject<HttpClient>()
    val callbackUrl = "${env.serverConfig.apiUrl}/auth/myanimelist/callback"
    val credentials = env.malCredentials
    val codeChallenges = mutableMapOf<String, String>()
    val authService by inject<AuthService>()

    install(Authentication) {
        oauth(Auth.MAL_OAUTH) {
            client = httpClient
            urlProvider = { callbackUrl }
            providerLookup = {
                val provider = MalOauthProvider(
                    ctx = this,
                    credentials = credentials,
                    callbackUrl = callbackUrl,
                    codeChallenges = codeChallenges
                )

                provider.getSettings()
            }
        }

        session<UserSession>(USER_SESSION) {
            validate { sessionId ->
                val session = authService.getSession(sessionId)
                session?.let { Auth.UserSession(it.id, it.userId) }
            }

            challenge {
                call.respond(HttpStatusCode.Unauthorized)
            }
        }
    }
}