package xyz.aniways.plugins

import io.ktor.server.application.*
import io.ktor.server.sessions.*
import kotlinx.serialization.Serializable
import xyz.aniways.env
import kotlin.time.Duration.Companion.days

typealias UserSession = String

const val USER_SESSION = "user_session"

@Serializable
data class RedirectTo(val url: String)

const val REDIRECT_TO = "redirect_to"

fun Application.configureSession() {
    val domain = env.serverConfig.rootDomain

    install(Sessions) {
        cookie<UserSession>(USER_SESSION) {
            cookie.maxAge = 30.days
            cookie.httpOnly = true
            cookie.sameSite = "lax"
            cookie.path = "/"
            cookie.domain = if (domain == "localhost") null else ".$domain"
        }
        cookie<RedirectTo>(REDIRECT_TO)
    }
}
