package xyz.aniways.features.library

import io.ktor.resources.*
import io.ktor.server.auth.*
import io.ktor.server.resources.*
import io.ktor.server.resources.post
import io.ktor.server.resources.put
import io.ktor.server.response.*
import io.ktor.server.routing.*
import xyz.aniways.features.library.db.LibraryStatus
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
        val status: LibraryStatus? = null,
        val epNo: Int? = null
    ) {
        @Resource("/history/{epNo}")
        class History(val parent: Anime, val epNo: Int)

        @Resource("/watched/{epNo}")
        class Watched(val parent: Anime, val epNo: Int)
    }
}

fun Route.libraryRoutes() {
    authenticate(USER_SESSION) {
        // Get library
        get<LibraryRoutes> { route ->
            call.respondText { "Get library with filters: ${route.status}" }
        }

        // Get history
        get<LibraryRoutes.History> {
            call.respondText { "Get history" }
        }

        // Add to library
        post<LibraryRoutes.Anime> { route ->
            call.respondText { "Add ${route.animeId} to library" }
        }

        // On every page navigation add this and update current ep if already in history
        put<LibraryRoutes.Anime.History> { route ->
            call.respondText { "Update ${route.parent.animeId} to episode ${route.epNo}" }
        }

        // After watching an episode till finish or user manually updates
        put<LibraryRoutes.Anime.Watched> { route ->
            call.respondText { "Update ${route.parent.animeId} to episode ${route.epNo}" }
        }

        // Manual update of library e.g. change status to dropped
        put<LibraryRoutes> { route ->
            call.respondText { "Update library" }
        }

        // Remove from library
        delete<LibraryRoutes.Anime> { route ->
            call.respondText { "Remove ${route.animeId} from library" }
        }
    }
}