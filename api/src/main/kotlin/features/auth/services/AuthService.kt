package xyz.aniways.features.auth.services

import io.ktor.server.auth.*
import xyz.aniways.features.auth.daos.SessionDao
import xyz.aniways.features.auth.daos.TokenDao
import xyz.aniways.features.users.UnauthorizedException
import xyz.aniways.features.users.UserService
import xyz.aniways.features.users.dtos.AuthDto
import java.time.Instant

class AuthService(
    private val sessionDao: SessionDao,
    private val tokenDao: TokenDao,
    private val userService: UserService,
) {
    suspend fun login(creds: AuthDto): String {
        val user = userService.authenticateUser(creds.email, creds.password)
        val session = sessionDao.createSession(user.id)

        return session
    }

    suspend fun getProviders(userId: String) = tokenDao.getProviders(userId)

    suspend fun logout(session: String) {
        sessionDao.deleteSession(session)
    }

    suspend fun saveOauthToken(userId: String, provider: String, principal: OAuthAccessTokenResponse.OAuth2) {
        tokenDao.createToken(
            userId = userId,
            token = principal.accessToken,
            refreshToken = principal.refreshToken ?: "",
            expiresAt = Instant.ofEpochMilli(System.currentTimeMillis() + principal.expiresIn * 1000),
            provider = provider
        )
    }

    suspend fun getAccessToken(provider: String, userId: String): String {
        val token = tokenDao.getToken(userId, provider)
        return token?.token ?: throw UnauthorizedException("Token not found")
    }

    suspend fun getSession(sessionId: String) = sessionDao.getSession(sessionId)
}