package xyz.aniways.plugins

import io.ktor.server.application.*
import io.ktor.server.sessions.*
import kotlinx.serialization.Serializable
import xyz.aniways.env

sealed class Session {
    @Serializable
    data class UserSession(val token: String) : Session() {
        companion object {
            const val KEY = "session"
        }
    }

    @Serializable
    data class RedirectTo(val url: String) : Session() {
        companion object {
            const val KEY = "redirect_to"
        }
    }
}

fun Application.configureSession() {
    val domain = env.serverConfig.rootDomain

    install(Sessions) {
        cookie<Session.UserSession>(Session.UserSession.KEY) {
            cookie.maxAgeInSeconds = 60 * 60 * 24 * 30 // 30 days
            cookie.httpOnly = true
            cookie.sameSite = "lax"
            cookie.path = "/"
            cookie.domain = if (domain == "localhost") null else ".$domain"
        }
        cookie<Session.RedirectTo>(Session.RedirectTo.KEY)
    }
}
