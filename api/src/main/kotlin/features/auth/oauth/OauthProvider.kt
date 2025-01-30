package xyz.aniways.features.auth.oauth

import io.ktor.server.auth.*
import java.security.MessageDigest
import java.util.*

abstract class OauthProvider {
    protected fun createCodeChallenge(length: Int = 43): String {
        if (length < 43 || length > 128) {
            throw IllegalArgumentException("Code challenge length must be between 43 and 128 characters.")
        }

        val charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
        val codeVerifier = (1..length).map { charset.random() }.joinToString("")

        val hash = MessageDigest
            .getInstance("SHA-256")
            .digest(codeVerifier.toByteArray())

        return Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(hash)
    }

    abstract fun getSettings(): OAuthServerSettings.OAuth2ServerSettings
}