package xyz.aniways.features.users

import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.resources.*
import io.ktor.server.resources.post
import io.ktor.server.resources.put
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.users.dtos.AuthDto
import xyz.aniways.features.users.dtos.CreateUserDto
import xyz.aniways.features.users.dtos.UpdatePasswordDto
import xyz.aniways.features.users.dtos.UpdateUserDto
import xyz.aniways.plugins.Auth
import xyz.aniways.plugins.USER_SESSION

@Resource("/users")
class UserRoutes {
    @Resource("/{id}")
    class UserByIdRoute(val parent: UserRoutes, val id: String)

    @Resource("/password")
    class UserPasswordRoute(val parent: UserRoutes)

    @Resource("/image")
    class UserImageRoute(val parent: UserRoutes)
}

fun Route.userRoutes() {
    val service by inject<UserService>()

    // Create a new user
    post<UserRoutes> {
        val body = call.receive<CreateUserDto>()
        val user = service.createUser(body)
        call.respond(user)
    }

    // Upload a image
    post<UserRoutes.UserImageRoute> {
        val stream = call.receiveStream()
        val image = stream.readBytes()
        val file = service.uploadImage(image)
        call.respond(
            mapOf("url" to file)
        )
    }

    authenticate(USER_SESSION) {
        // Get a user
        get<UserRoutes.UserByIdRoute> { route ->
            val userId = call.principal<Auth.UserSession>()?.userId
                ?: return@get call.respond(HttpStatusCode.Unauthorized)

            if (userId != route.id) {
                return@get call.respond(HttpStatusCode.Forbidden)
            }

            val user = service.getUserById(userId)
            call.respond(user)
        }

        // Update a user
        put<UserRoutes> {
            val userId = call.principal<Auth.UserSession>()?.userId
                ?: return@put call.respond(HttpStatusCode.Unauthorized)
            val body = call.receive<UpdateUserDto>()
            // Prevent updating password through this route
            if (body.password != null) {
                return@put call.respond(HttpStatusCode.BadRequest)
            }
            val user = service.updateUser(userId, body)
            call.respond(user)
        }

        // Update a user's password
        put<UserRoutes.UserPasswordRoute> {
            val userId = call.principal<Auth.UserSession>()?.userId
                ?: return@put call.respond(HttpStatusCode.Unauthorized)
            val body = call.receive<UpdatePasswordDto>()
            val user = service.updateUserPassword(userId, body)
            call.respond(user)
        }

        // Delete a user
        delete<UserRoutes> {
            val userId = call.principal<Auth.UserSession>()?.userId
                ?: return@delete call.respond(HttpStatusCode.Unauthorized)
            val body = call.receive<AuthDto>()
            service.deleteUser(userId, body.email, body.password)
            call.respond(HttpStatusCode.OK)
        }
    }
}