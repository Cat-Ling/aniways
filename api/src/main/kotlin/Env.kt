package xyz.aniways

import io.ktor.server.application.*


data class Env(
    val dbUrl: String,
    val dbUser: String,
    val dbPassword: String,
)

val Application.env: Env
    get() {
        val environment = this.environment.config

        val dbUrl = environment.property("db.url").getString()
        val dbUser = environment.property("db.user").getString()
        val dbPassword = environment.property("db.password").getString()

        if (dbUrl.isBlank() || dbUser.isBlank() || dbPassword.isBlank()) {
            throw IllegalArgumentException(
                "Database configuration is missing. Please ensure 'db.url', 'db.user', and 'db.password' are set in the configuration."
            )
        }

        if (!dbUrl.startsWith("jdbc:postgresql://")) {
            throw IllegalArgumentException(
                "Invalid database URL: Only PostgreSQL is supported. The provided URL is: $dbUrl"
            )
        }

        return Env(dbUrl, dbUser, dbPassword)
    }