package xyz.aniways.features.auth.oauth

import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*
import xyz.aniways.Env
import xyz.aniways.plugins.RedirectTo

class MalOauthProvider(
    private val ctx: ApplicationCall,
    private val credentials: Env.MalCredentials,
    private val callbackUrl: String,
    private val codeChallenges: MutableMap<String, String>
) : OauthProvider() {
    override fun getSettings() = OAuthServerSettings.OAuth2ServerSettings(
        name = "mal",
        authorizeUrl = "https://myanimelist.net/v1/oauth2/authorize",
        accessTokenUrl = "https://myanimelist.net/v1/oauth2/token",
        requestMethod = HttpMethod.Post,
        clientId = credentials.clientId,
        clientSecret = credentials.clientSecret,
        authorizeUrlInterceptor = {
            val codeChallenge = createCodeChallenge()
            val state = parameters["state"] ?: throw IllegalStateException("State must be set.")
            codeChallenges[state] = codeChallenge
            parameters.append("code_challenge", codeChallenge)
        },
        accessTokenInterceptor = {
            val state = ctx.parameters["state"] ?: throw IllegalStateException("State must be set.")
            val codeVerifier = codeChallenges.remove(state)
                ?: throw IllegalStateException("Code verifier not found.")

            val body = ParametersBuilder().apply {
                appendAll(ctx.parameters)
                append("client_id", credentials.clientId)
                append("client_secret", credentials.clientSecret)
                append("grant_type", "authorization_code")
                append("redirect_uri", callbackUrl)
                append("code_verifier", codeVerifier)
            }

            setBody(
                TextContent(
                    body.build().formUrlEncode(),
                    ContentType.Application.FormUrlEncoded
                )
            )
        },
        onStateCreated = { call, _ ->
            val url = call.request.queryParameters["redirectUrl"] ?: "/"
            call.sessions.set(RedirectTo(url))
        }
    )
}