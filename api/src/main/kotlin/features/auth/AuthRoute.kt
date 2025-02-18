package xyz.aniways.features.auth

import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.Route
import io.ktor.server.sessions.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.auth.services.AuthService
import xyz.aniways.features.auth.services.MalUserService
import xyz.aniways.features.users.dtos.AuthDto
import xyz.aniways.plugins.Auth
import xyz.aniways.plugins.Session
import xyz.aniways.plugins.USER_SESSION
import xyz.aniways.plugins.UserSession

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
    val malUserService by inject<MalUserService>()
    val authService by inject<AuthService>()

    post<AuthRoute.Login> {
        val redirectTo = call.request.queryParameters["redirectUrl"]
        val body = call.receive<AuthDto>()
        val session = authService.login(body)
        call.sessions.set(USER_SESSION, session)
        redirectTo ?: return@post call.respond(HttpStatusCode.OK)
        call.respondRedirect(redirectTo)
    }

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
            val currentUser = call.principal<Auth.UserPrincipal>()
            currentUser ?: return@get call.respond(HttpStatusCode.Unauthorized)

            malUserService.getUserInfo(currentUser.token).let {
                call.respond(it)
            }
        }
    }

    get<AuthRoute.Logout> {
        val redirectTo = call.request.queryParameters["redirectUrl"] ?: "/"
        call.sessions.clear(Session.UserSession.KEY)
        val userSession = call.sessions.get<UserSession>()
        userSession?.let {
            authService.logout(it)
            call.sessions.clear(USER_SESSION)
        }
        call.respondRedirect(redirectTo)
    }
}