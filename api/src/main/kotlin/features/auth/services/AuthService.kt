package xyz.aniways.features.auth.services

import xyz.aniways.features.auth.daos.SessionDao
import xyz.aniways.features.users.UserService
import xyz.aniways.features.users.dtos.AuthDto

class AuthService(
    private val sessionDao: SessionDao,
    private val userService: UserService,
) {
    suspend fun login(creds: AuthDto): String {
        val user = userService.authenticateUser(creds.email, creds.password)
        val session = sessionDao.createSession(user.id)

        return session
    }

    suspend fun logout(session: String) {
        sessionDao.deleteSession(session)
    }
}