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
import xyz.aniways.plugins.USER_SESSION

@Resource("/settings")
class SettingsRoute

// TODO: SETTINGS BROKEN COS BASED ON MAL AUTH
fun Route.settingsRoutes() {
    val settingsService by inject<SettingsService>()

    authenticate(USER_SESSION) {
        get<SettingsRoute> {
            val session = call.principal<Auth.UserSession>()
            session ?: return@get call.respond(HttpStatusCode.Unauthorized)

            val settings = settingsService
                .getSettingsByUserId(session.userId.toInt())
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