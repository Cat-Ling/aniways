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
import xyz.aniways.features.users.UserService
import xyz.aniways.features.users.dtos.AuthDto
import xyz.aniways.plugins.*

@Resource("/auth")
class AuthRoute() {
    @Resource("/login")
    class Login(val parent: AuthRoute)

    @Resource("/myanimelist/login")
    class MalLogin(val parent: AuthRoute)

    @Resource("/myanimelist/callback")
    class Callback(val parent: AuthRoute)

    @Resource("/me")
    class Me(val parent: AuthRoute)

    @Resource("/providers")
    class Providers(val parent: AuthRoute)

    @Resource("/logout")
    class Logout(val parent: AuthRoute)
}

fun Route.authRoutes() {
    val authService by inject<AuthService>()
    val userService by inject<UserService>()

    post<AuthRoute.Login> {
        val redirectTo = call.request.queryParameters["redirectUrl"]
        val body = call.receive<AuthDto>()
        val session = authService.login(body)
        call.sessions.set(USER_SESSION, session)
        redirectTo ?: return@post call.respond(HttpStatusCode.OK)
        call.respondRedirect(redirectTo)
    }

    // Need to be logged in to even connect MAL
    authenticate(USER_SESSION, strategy = AuthenticationStrategy.Required) {
        authenticate(Auth.MAL_OAUTH, strategy = AuthenticationStrategy.Required) {
            get<AuthRoute.MalLogin> {}

            get<AuthRoute.Callback> {
                val currentPrincipal = call.principal<OAuthAccessTokenResponse.OAuth2>()
                currentPrincipal ?: return@get call.respond(HttpStatusCode.Unauthorized)

                val userSession = call.sessions.get<Auth.UserSession>()
                    ?: return@get call.respond(HttpStatusCode.Unauthorized)

                authService.saveOauthToken(userSession.userId, "myanimelist", currentPrincipal)

                val redirectTo = call.sessions.get<RedirectTo>()?.url ?: "/"
                call.sessions.clear(REDIRECT_TO)

                call.respondRedirect(redirectTo)
            }
        }
    }

    authenticate(USER_SESSION) {
        get<AuthRoute.Me> {
            val session = call.principal<Auth.UserSession>(USER_SESSION)
            session ?: return@get call.respond(HttpStatusCode.Unauthorized)

            val user = userService.getUserById(session.userId)

            call.respond(user)
        }

        get<AuthRoute.Providers> {
            val currentUser = call.principal<Auth.UserSession>(USER_SESSION)
            currentUser ?: return@get call.respond(HttpStatusCode.Unauthorized)

            call.respond(authService.getProviders(currentUser.userId))
        }
    }

    get<AuthRoute.Logout> {
        val redirectTo = call.request.queryParameters["redirectUrl"] ?: "/"
        val userSession = call.sessions.get<UserSession>()
        userSession?.let {
            authService.logout(it)
            call.sessions.clear(USER_SESSION)
        }
        call.respondRedirect(redirectTo)
    }
}