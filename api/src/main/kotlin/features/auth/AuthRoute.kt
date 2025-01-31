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
class AuthRoute() {
    @Resource("/login")
    class Login(val parent: AuthRoute)

    @Resource("/callback")
    class Callback(val parent: AuthRoute)

    @Resource("/me")
    class Me(val parent: AuthRoute)

    @Resource("/logout")
    class Logout(val parent: AuthRoute)
}

fun Route.authRoutes() {
    authenticate(Auth.MAL_OAUTH) {
        get<AuthRoute.Login> {}

        get<AuthRoute.Callback> {
            val currentPrincipal = call.principal<OAuthAccessTokenResponse.OAuth2>()
            currentPrincipal ?: return@get call.respond(HttpStatusCode.Unauthorized)

            call.sessions.set(Session.UserSession(currentPrincipal.accessToken))

            val redirectTo = call.sessions.get<Session.RedirectTo>()?.url ?: "/"
            call.sessions.clear(Session.RedirectTo.KEY)

            call.respondRedirect(redirectTo)
        }

    }

    authenticate(Auth.SESSION) {
        get<AuthRoute.Me> {
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

    get<AuthRoute.Logout> {
        val redirectTo = call.request.queryParameters["redirectUrl"] ?: "/"
        call.sessions.clear(Session.UserSession.KEY)
        call.respondRedirect(redirectTo)
    }
}