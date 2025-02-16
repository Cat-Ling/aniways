package xyz.aniways.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import xyz.aniways.env

fun Application.configureCors() {
    val allowHost = env.serverConfig.frontendDomain

    install(CORS) {
        allowHost(allowHost)

        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Options)

        allowCredentials = true
    }
}