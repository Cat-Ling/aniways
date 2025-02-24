package xyz.aniways.features.library

import io.ktor.http.*
import io.ktor.resources.*
import io.ktor.server.auth.*
import io.ktor.server.resources.*
import io.ktor.server.resources.post
import io.ktor.server.resources.put
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.auth.db.Provider
import xyz.aniways.features.library.db.LibraryStatus
import xyz.aniways.plugins.Auth
import xyz.aniways.plugins.USER_SESSION

@Resource("/library")
class LibraryRoutes(
    val status: LibraryStatus = LibraryStatus.ALL,
    val page: Int = 1,
    val itemsPerPage: Int = 20
) {
    @Resource("/status/running")
    class RunningStatuses(val parent: LibraryRoutes)

    @Resource("/pull/{provider}")
    class Pull(val parent: LibraryRoutes, val provider: Provider) {

        @Resource("/status/{syncId}")
        class Status(val parent: Pull, val syncId: String)
    }

    @Resource("/history")
    class History(val parent: LibraryRoutes)

    @Resource("/{animeId}")
    class Anime(
        val parent: LibraryRoutes,
        val animeId: String,
        val status: LibraryStatus? = null,
        val epNo: Int? = null
    ) {
        @Resource("/history/{epNo}")
        class History(val parent: Anime, val epNo: Int)
    }

    @Resource("/{animeId}/history")
    class HistoryAnime(val parent: LibraryRoutes, val animeId: String)
}

fun Route.libraryRoutes() {
    val service by inject<LibraryService>()

    authenticate(USER_SESSION) {
        // Get library
        get<LibraryRoutes> { route ->
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@get call.respond(HttpStatusCode.Unauthorized)

            val result = service.getLibrary(
                userId = currentUser.userId,
                status = route.status,
                itemsPerPage = route.itemsPerPage,
                page = route.page
            )

            call.respond(result)
        }

        // Get history
        get<LibraryRoutes.History> {
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@get call.respond(HttpStatusCode.Unauthorized)

            val result = service.getHistory(
                userId = currentUser.userId,
                itemsPerPage = it.parent.itemsPerPage,
                page = it.parent.page
            )

            call.respond(result)
        }

        // Get library anime
        get<LibraryRoutes.Anime> {
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@get call.respond(HttpStatusCode.Unauthorized)

            val result = service.getLibraryAnime(
                userId = currentUser.userId,
                animeId = it.animeId
            )

            call.respond(result)
        }

        // Get history anime
        get<LibraryRoutes.HistoryAnime> {
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@get call.respond(HttpStatusCode.Unauthorized)

            val result = service.getHistoryAnime(
                userId = currentUser.userId,
                animeId = it.animeId
            )

            call.respond(result)
        }

        // Add to library, if already in library update current ep
        post<LibraryRoutes.Anime> { route ->
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@post call.respond(HttpStatusCode.Unauthorized)

            if (route.status == null || route.epNo == null) {
                call.respond(HttpStatusCode.BadRequest)
                return@post
            }

            service.saveToLibrary(
                userId = currentUser.userId,
                animeId = route.animeId,
                status = route.status,
                watchedEpisodes = route.epNo
            )

            call.respond(HttpStatusCode.Created)
        }

        // On every page navigation add this and update current ep if already in history
        put<LibraryRoutes.Anime.History> { route ->
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@put call.respond(HttpStatusCode.Unauthorized)

            service.saveToHistory(
                userId = currentUser.userId,
                animeId = route.parent.animeId,
                epNo = route.epNo
            )

            call.respond(HttpStatusCode.Created)
        }

        // Remove from library
        delete<LibraryRoutes.Anime> { route ->
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@delete call.respond(HttpStatusCode.Unauthorized)

            service.deleteFromLibrary(
                userId = currentUser.userId,
                animeId = route.animeId
            )

            call.respond(HttpStatusCode.NoContent)
        }

        // Remove all from library
        delete<LibraryRoutes> {
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@delete call.respond(HttpStatusCode.Unauthorized)

            service.deleteAllFromLibrary(
                userId = currentUser.userId
            )

            call.respond(HttpStatusCode.NoContent)
        }

        // Remove from history
        delete<LibraryRoutes.HistoryAnime> { route ->
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@delete call.respond(HttpStatusCode.Unauthorized)

            service.deleteFromHistory(
                userId = currentUser.userId,
                animeId = route.animeId
            )

            call.respond(HttpStatusCode.NoContent)
        }

        // Sync library
        post<LibraryRoutes.Pull> { route ->
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@post call.respond(HttpStatusCode.Unauthorized)

            val syncId = service.startSyncingLibrary(
                userId = currentUser.userId,
                provider = route.provider
            )

            call.respond(mapOf("syncId" to syncId))
        }

        // Get running syncs
        get<LibraryRoutes.RunningStatuses> {
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@get call.respond(HttpStatusCode.Unauthorized)

            val statuses = service.getRunningSyncs(currentUser.userId)

            call.respond(mapOf("statuses" to statuses))
        }

        // Get sync status
        get<LibraryRoutes.Pull.Status> { route ->
            val status = service.getSyncStatus(syncId = route.syncId)
            call.respond(mapOf("status" to status))
        }
    }
}