package xyz.aniways.features.auth.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.auth.oauth.MalOauthProvider
import xyz.aniways.features.auth.plugins.Auth
import xyz.aniways.features.auth.plugins.Session
import xyz.aniways.features.auth.plugins.configureAuth
import xyz.aniways.features.auth.plugins.configureSession
import xyz.aniways.features.auth.services.MalUserService

fun Application.authRoutes() {
    val malUserService by inject<MalUserService>()

    configureSession()
    configureAuth()

    routing {
        route("/auth") {
            authenticate(Auth.MAL_OAUTH) {
                get("/login") {}

                get("/callback") {
                    val currentPrincipal = call.principal<OAuthAccessTokenResponse.OAuth2>()
                        ?: return@get call.respond(HttpStatusCode.Unauthorized)

                    call.sessions.set(Session.UserSession(currentPrincipal.accessToken))

                    val redirectTo = call.sessions.get<Session.RedirectTo>()?.url ?: "/"
                    call.sessions.clear(Session.RedirectTo.KEY)

                    call.respondRedirect(redirectTo)
                }

            }

            authenticate(Auth.SESSION) {
                get("/me") {
                    val session = call.principal<Session.UserSession>()
                        ?: return@get call.respond(HttpStatusCode.Unauthorized)

                    malUserService.getUserInfo(session.token).let {
                        call.respond(it)
                    }.runCatching {
                        call.respond(HttpStatusCode.InternalServerError)
                    }
                }

                get("/logout") {
                    val redirectTo = call.request.queryParameters["redirectUrl"] ?: "/"
                    call.sessions.clear(Session.UserSession.KEY)
                    call.respondRedirect(redirectTo)
                }
            }
        }
    }
}