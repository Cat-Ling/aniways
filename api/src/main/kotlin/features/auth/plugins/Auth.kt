package xyz.aniways.features.auth.plugins

import io.ktor.client.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import org.koin.ktor.ext.inject
import xyz.aniways.env
import xyz.aniways.features.auth.oauth.MalOauthProvider

object Auth {
    const val MAL_OAUTH = "mal-oauth"
    const val SESSION = Session.UserSession.KEY
}

fun Application.configureAuth() {
    val httpClient by inject<HttpClient>()
    val callbackUrl = "${env.serverConfig.url}/auth/callback"
    val codeChallenges = mutableMapOf<String, String>()

    install(Authentication) {
        oauth(Auth.MAL_OAUTH) {
            client = httpClient
            urlProvider = { callbackUrl }
            providerLookup = {
                val provider = MalOauthProvider(
                    ctx = this,
                    credentials = this@configureAuth.env.malCredentials,
                    callbackUrl = callbackUrl,
                    codeChallenges = codeChallenges
                )

                provider.getSettings()
            }
        }

        session<Session.UserSession>(Auth.SESSION) {
            validate {
                it.takeIf { it.token.isNotEmpty() }
            }

            challenge {
                call.respondRedirect("/auth/login?redirectUrl=${call.request.uri}")
            }
        }
    }
}