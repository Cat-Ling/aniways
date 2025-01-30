package xyz.aniways.features.settings

import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.plugins.Auth
import xyz.aniways.features.settings.dtos.SettingsDto
import xyz.aniways.features.settings.dtos.toDto
import xyz.aniways.features.settings.services.SettingsService

fun Routing.settingsRoutes() {
    val settingsService by inject<SettingsService>()

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