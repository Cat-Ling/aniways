package xyz.aniways.features.settings.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.auth.plugins.Auth
import xyz.aniways.features.auth.plugins.Session
import xyz.aniways.features.auth.services.MalUserService
import xyz.aniways.features.settings.dtos.SettingsDto
import xyz.aniways.features.settings.dtos.toDto
import xyz.aniways.features.settings.services.SettingsService

fun Application.settingsRoutes() {
    val malUserService by inject<MalUserService>()
    val settingsService by inject<SettingsService>()

    routing {
        authenticate(Auth.SESSION) {
            route("/settings") {
                get {
                    val session = call.principal<Session.UserSession>()
                    session ?: throw IllegalStateException("No session found")
                    val currentUser = malUserService.getUserInfo(session.token)

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