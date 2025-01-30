package xyz.aniways.features.auth

import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.server.auth.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.auth.services.MalUserService
import xyz.aniways.plugins.Auth
import xyz.aniways.plugins.Session

@Resource("/auth")
class AuthRoutes() {
    @Resource("/login")
    class Login(val parent: AuthRoutes)

    @Resource("/callback")
    class Callback(val parent: AuthRoutes)

    @Resource("/me")
    class Me(val parent: AuthRoutes)

    @Resource("/logout")
    class Logout(val parent: AuthRoutes)
}

fun Route.authRoutes() {
    authenticate(Auth.MAL_OAUTH) {
        get<AuthRoutes.Login> {}

        get<AuthRoutes.Callback> {
            val currentPrincipal = call.principal<OAuthAccessTokenResponse.OAuth2>()
            currentPrincipal ?: return@get call.respond(HttpStatusCode.Unauthorized)

            call.sessions.set(Session.UserSession(currentPrincipal.accessToken))

            val redirectTo = call.sessions.get<Session.RedirectTo>()?.url ?: "/"
            call.sessions.clear(Session.RedirectTo.KEY)

            call.respondRedirect(redirectTo)
        }

    }

    authenticate(Auth.SESSION) {
        get<AuthRoutes.Me> {
            val malUserService by inject<MalUserService>()

            val currentUser = call.principal<Auth.UserPrincipal>()
            currentUser ?: return@get call.respond(HttpStatusCode.Unauthorized)

            malUserService.getUserInfo(currentUser.token).let {
                call.respond(it)
            }.runCatching {
                call.respond(HttpStatusCode.InternalServerError)
            }
        }
    }

    get<AuthRoutes.Logout> {
        val redirectTo = call.request.queryParameters["redirectUrl"] ?: "/"
        call.sessions.clear(Session.UserSession.KEY)
        call.respondRedirect(redirectTo)
    }
}