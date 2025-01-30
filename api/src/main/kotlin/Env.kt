package xyz.aniways

import io.ktor.server.application.*


data class Env(
    val serverConfig: ServerConfig,
    val dbConfig: DBConfig,
    val malCredentials: MalCredentials,
)

data class ServerConfig(
    val url: String,
)

data class DBConfig(
    val url: String,
    val user: String,
    val password: String,
)

data class MalCredentials(
    val clientId: String,
    val clientSecret: String,
)

val Application.env: Env
    get() {
        val environment = this.environment.config

        val serverUrl = environment.property("ktor.url").getString()
        if (serverUrl.isBlank()) {
            throw IllegalArgumentException(
                "Server URL is missing. Please ensure 'ktor.url' is set in the configuration."
            )
        }

        val serverConfig = ServerConfig(
            url = serverUrl
        )

        val dbUrl = environment.property("db.url").getString()
        val dbUser = environment.property("db.username").getString()
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

        val dbConfig = DBConfig(
            url = dbUrl,
            user = dbUser,
            password = dbPassword
        )

        val malClientId = environment.property("mal.clientId").getString()
        val malClientSecret = environment.property("mal.clientSecret").getString()

        if (malClientId.isBlank() || malClientSecret.isBlank()) {
            throw IllegalArgumentException(
                "MyAnimeList OAuth credentials are missing. Please ensure 'mal.clientId' and 'mal.clientSecret' are set in the configuration."
            )
        }

        val malCredentials = MalCredentials(
            clientId = malClientId,
            clientSecret = malClientSecret
        )

        return Env(
            serverConfig = serverConfig,
            dbConfig = dbConfig,
            malCredentials = malCredentials,
        )
    }