package xyz.aniways.features.user.routes

import io.ktor.server.application.*
import org.koin.ktor.ext.inject
import xyz.aniways.features.user.dao.UserDao

fun Application.userRoutes() {
    val userDao by inject<UserDao>()
}