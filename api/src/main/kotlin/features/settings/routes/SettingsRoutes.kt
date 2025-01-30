package xyz.aniways.features.settings.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.auth.plugins.Auth
import xyz.aniways.features.settings.dtos.SettingsDto
import xyz.aniways.features.settings.dtos.toDto
import xyz.aniways.features.settings.services.SettingsService

fun Application.settingsRoutes() {
    val settingsService by inject<SettingsService>()

    routing {
        authenticate(Auth.SESSION) {
            route("/settings") {
                get {
                    val currentUser = call.principal<Auth.UserPrincipal>()
                    currentUser ?: throw IllegalStateException("No session found")

                    val settings = settingsService
                        .getSettingsByUserId(currentUser.id)
                        .toDto()

                    call.respond(settings)
                }

                post {
                    val settings = call.receive<SettingsDto>().toEntity()

                    settingsService.saveSettings(settings)

                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}