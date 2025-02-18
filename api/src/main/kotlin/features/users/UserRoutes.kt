package xyz.aniways.features.users

import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.server.request.*
import io.ktor.server.resources.*
import io.ktor.server.response.*
import io.ktor.server.routing.Route
import org.koin.ktor.ext.inject
import xyz.aniways.features.users.dtos.AuthDto
import xyz.aniways.features.users.dtos.CreateUserDto
import xyz.aniways.features.users.dtos.UpdateUserDto

@Resource("/users")
class UserRoutes {
    @Resource("/{id}")
    class UserByIdRoute(val parent: UserRoutes, val id: String)
}

fun Route.userRoutes() {
    val service by inject<UserService>()

    // Create a new user
    post<UserRoutes> {
        val body = call.receive<CreateUserDto>()
        val user = service.createUser(body)
        call.respond(user)
    }

    /* TODO: PROTECTED ROUTES */
    // Get a user
    get<UserRoutes.UserByIdRoute> { route ->
        val user = service.getUserById(route.id)
        call.respond(user)
    }

    // Update a user
    put<UserRoutes.UserByIdRoute> { route ->
        val body = call.receive<UpdateUserDto>()
        val user = service.updateUser(route.id, body)
        call.respond(user)
    }

    // Delete a user
    delete<UserRoutes.UserByIdRoute> { route ->
        val body = call.receive<AuthDto>()
        service.deleteUser(route.id, body.email, body.password)
        call.respond(HttpStatusCode.OK)
    }
}