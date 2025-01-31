package xyz.aniways.features.settings

import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.resources.*
import io.ktor.server.resources.post
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.settings.dtos.SettingsDto
import xyz.aniways.features.settings.dtos.toDto
import xyz.aniways.features.settings.services.SettingsService
import xyz.aniways.plugins.Auth

@Resource("/settings")
class SettingsRoute

fun Route.settingsRoutes() {
    val settingsService by inject<SettingsService>()

    authenticate(Auth.SESSION) {
        get<SettingsRoute> {
            val currentUser = call.principal<Auth.UserPrincipal>()
            currentUser ?: throw IllegalStateException("No session found")

            val settings = settingsService
                .getSettingsByUserId(currentUser.id)
                .toDto()

            call.respond(settings)
        }

        post<SettingsRoute> {
            val settings = call.receive<SettingsDto>().toEntity()

            settingsService.saveSettings(settings)

            call.respond(HttpStatusCode.OK)
        }
    }
}