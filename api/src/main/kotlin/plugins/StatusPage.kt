package xyz.aniways.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import kotlinx.serialization.Serializable
import xyz.aniways.features.users.UnauthorizedException
import xyz.aniways.features.users.dao.UserNotFoundException
import xyz.aniways.features.users.dao.UserUniqueConstraintException

@Serializable
data class ErrorResponse(val message: String)

fun Application.configureStatusPage() {
    install(StatusPages) {
        exception<UnauthorizedException> { call, cause ->
            val body = ErrorResponse(cause.message ?: "Unauthorized")
            call.respond(HttpStatusCode.Unauthorized, body)
        }

        exception<UserNotFoundException> { call, cause ->
            val body = ErrorResponse(cause.message ?: "Bad Request")
            call.respond(HttpStatusCode.NotFound, body)
        }

        exception<UserUniqueConstraintException> { call, cause ->
            val body = ErrorResponse(cause.message ?: "Not Found")
            call.respond(HttpStatusCode.BadRequest, body)
        }
    }
}