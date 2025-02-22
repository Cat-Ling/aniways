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
import xyz.aniways.features.library.db.LibraryStatus
import xyz.aniways.plugins.Auth
import xyz.aniways.plugins.USER_SESSION

@Resource("/library")
class LibraryRoutes(
    val status: LibraryStatus = LibraryStatus.ALL,
    val page: Int = 1,
    val itemsPerPage: Int = 20
) {
    @Resource("/history")
    class History(val parent: LibraryRoutes)

    @Resource("/{animeId}")
    class Anime(
        val parent: LibraryRoutes,
        val animeId: String,
        val status: LibraryStatus,
        val epNo: Int
    ) {
        @Resource("/history/{epNo}")
        class History(val parent: Anime, val epNo: Int)
    }

    @Resource("/{animeId}")
    class LibraryAnime(val parent: LibraryRoutes, val animeId: String)

    @Resource("/{animeId}/history")
    class HistoryAnime(val parent: LibraryRoutes, val animeId: String)

    @Resource("/{animeId}")
    class DeleteLibrary(val parent: LibraryRoutes, val animeId: String)

    @Resource("/{animeId}/history")
    class DeleteHistory(val parent: LibraryRoutes, val animeId: String)
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
        get<LibraryRoutes.LibraryAnime> {
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
        delete<LibraryRoutes.DeleteLibrary> { route ->
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@delete call.respond(HttpStatusCode.Unauthorized)

            service.deleteFromLibrary(
                userId = currentUser.userId,
                animeId = route.animeId
            )

            call.respond(HttpStatusCode.NoContent)
        }

        // Remove from history
        delete<LibraryRoutes.DeleteHistory> { route ->
            val currentUser = call.principal<Auth.UserSession>()
            currentUser ?: return@delete call.respond(HttpStatusCode.Unauthorized)

            service.deleteFromHistory(
                userId = currentUser.userId,
                animeId = route.animeId
            )

            call.respond(HttpStatusCode.NoContent)
        }
    }
}