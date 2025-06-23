package xyz.aniways.features.auth.services

import io.ktor.server.auth.*
import xyz.aniways.features.auth.daos.ResetPasswordDao
import xyz.aniways.features.auth.daos.SessionDao
import xyz.aniways.features.auth.daos.TokenDao
import xyz.aniways.features.auth.db.Provider
import xyz.aniways.features.users.UnauthorizedException
import xyz.aniways.features.users.UserService
import xyz.aniways.features.users.dtos.AuthDto
import xyz.aniways.features.users.dtos.UserDto
import java.time.Instant

class AuthService(
    private val sessionDao: SessionDao,
    private val tokenDao: TokenDao,
    private val resetPasswordDao: ResetPasswordDao,
    private val userService: UserService,
    private val emailService: EmailService,
) {
    suspend fun login(creds: AuthDto): String {
        val user = userService.authenticateUser(creds.email, creds.password)
        val session = sessionDao.createSession(user.id)

        return session
    }

    suspend fun getUserByForgotPasswordToken(token: String): UserDto {
        val userId = resetPasswordDao.getUserIdByResetPasswordToken(token)
            ?: throw UnauthorizedException("Invalid or expired reset password token")
        return userService.getUserById(userId)
    }

    suspend fun forgetPassword(email: String) {
        val user = userService.getUserByEmail(email)
        val token = resetPasswordDao.createResetPasswordToken(user.id)
        emailService.sendResetPasswordEmail(user.email, token)
    }

    suspend fun resetPassword(token: String, newPassword: String) {
        val userId = resetPasswordDao.getUserIdByResetPasswordToken(token)
            ?: throw UnauthorizedException("Invalid or expired reset password token")

        userService.resetUserPassword(userId, newPassword)
        resetPasswordDao.deleteResetPasswordToken(token)
    }

    suspend fun getProviders(userId: String) = tokenDao.getInstalledProviders(userId)

    suspend fun logout(session: String) {
        sessionDao.deleteSession(session)
    }

    suspend fun saveOauthToken(userId: String, provider: Provider, principal: OAuthAccessTokenResponse.OAuth2) {
        tokenDao.createToken(
            userId = userId,
            token = principal.accessToken,
            refreshToken = principal.refreshToken ?: "",
            expiresAt = Instant.ofEpochMilli(System.currentTimeMillis() + principal.expiresIn * 1000),
            provider = provider
        )
    }

    suspend fun getAccessToken(provider: Provider, userId: String): String {
        val token = tokenDao.getToken(userId, provider)
        return token?.token ?: throw UnauthorizedException("Token not found")
    }

    suspend fun getSession(sessionId: String) = sessionDao.getSession(sessionId)

    suspend fun deleteToken(token: String) {
        tokenDao.deleteToken(token)
    }
}