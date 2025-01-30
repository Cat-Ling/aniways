package xyz.aniways.features.auth

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.koin.ktor.ext.inject
import xyz.aniways.plugins.Auth
import xyz.aniways.plugins.Session
import xyz.aniways.plugins.configureAuth
import xyz.aniways.plugins.configureSession
import xyz.aniways.features.auth.services.MalUserService

fun Routing.authRoutes() {
    val malUserService by inject<MalUserService>()

    route("/auth") {
        authenticate(Auth.MAL_OAUTH) {
            get("/login") {}

            get("/callback") {
                val currentPrincipal = call.principal<OAuthAccessTokenResponse.OAuth2>()
                currentPrincipal ?: return@get call.respond(HttpStatusCode.Unauthorized)

                call.sessions.set(Session.UserSession(currentPrincipal.accessToken))

                val redirectTo = call.sessions.get<Session.RedirectTo>()?.url ?: "/"
                call.sessions.clear(Session.RedirectTo.KEY)

                call.respondRedirect(redirectTo)
            }

        }

        authenticate(Auth.SESSION) {
            get("/me") {
                val currentUser = call.principal<Auth.UserPrincipal>()
                currentUser ?: return@get call.respond(HttpStatusCode.Unauthorized)

                malUserService.getUserInfo(currentUser.token).let {
                    call.respond(it)
                }.runCatching {
                    call.respond(HttpStatusCode.InternalServerError)
                }
            }
        }

        get("/logout") {
            val redirectTo = call.request.queryParameters["redirectUrl"] ?: "/"
            call.sessions.clear(Session.UserSession.KEY)
            call.respondRedirect(redirectTo)
        }
    }
}