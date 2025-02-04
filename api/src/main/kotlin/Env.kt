package xyz.aniways

import io.ktor.server.application.*
import io.ktor.server.config.*
import java.io.File


data class Env(
    val serverConfig: ServerConfig,
    val dbConfig: DBConfig,
    val malCredentials: MalCredentials,
    val redisConfig: RedisConfig,
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

data class RedisConfig(
    val host: String,
    val port: Int,
)

val Application.env: Env
    get() {
        val envFile = System.getenv("ENV_FILE")

        return envFile?.let {
            this.log.info("Loading environment from file: $it")
            extractFromEnvFile(it)
        } ?: run {
            this.log.info("Loading environment from configuration")
            extractFromEnvConfig(this@env.environment.config)
        }
    }

private fun extractFromEnvFile(envFile: String): Env {
    val env = File(envFile).readLines()
        .filter { it.isNotBlank() && !it.startsWith("#") }
        .map { it.split("=") }
        .associate { it[0] to it[1].replace("\"", "") }

    val serverUrl = env["API_URL"] ?: throw IllegalArgumentException("API_URL is missing in the environment file.")
    val serverConfig = ServerConfig(
        url = serverUrl
    )

    val dbUrl = env["JDBC_POSTGRES_URL"] ?: throw IllegalArgumentException("JDBC_POSTGRES_URL is missing in the environment file.")
    val dbUser = env["POSTGRES_USER"] ?: throw IllegalArgumentException("POSTGRES_USER is missing in the environment file.")
    val dbPassword = env["POSTGRES_PASSWORD"] ?: throw IllegalArgumentException("POSTGRES_PASSWORD is missing in the environment file.")
    val dbConfig = DBConfig(
        url = dbUrl,
        user = dbUser,
        password = dbPassword
    )

    val malClientId = env["MAL_CLIENT_ID"] ?: throw IllegalArgumentException("MAL_CLIENT_ID is missing in the environment file.")
    val malClientSecret = env["MAL_CLIENT_SECRET"] ?: throw IllegalArgumentException("MAL_CLIENT_SECRET is missing in the environment file.")
    val malCredentials = MalCredentials(
        clientId = malClientId,
        clientSecret = malClientSecret,
    )

    val redisHost = env["REDIS_HOST"] ?: throw IllegalArgumentException("REDIS_HOST is missing in the environment file.")
    val redisPort = env["REDIS_PORT"]?.toIntOrNull() ?: throw IllegalArgumentException("REDIS_PORT is missing in the environment file.")
    val redisConfig = RedisConfig(
        host = redisHost,
        port = redisPort
    )

    return Env(
        serverConfig = serverConfig,
        dbConfig = dbConfig,
        malCredentials = malCredentials,
        redisConfig = redisConfig
    )
}

private fun extractFromEnvConfig(environment: ApplicationConfig): Env {
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

    val redisHost = environment.property("redis.host").getString()
    val redisPort = environment.property("redis.port").getString().toIntOrNull()

    if (redisHost.isBlank() || redisPort == null) {
        throw IllegalArgumentException(
            "Redis configuration is missing. Please ensure 'redis.host' and 'redis.port' are set in the configuration."
        )
    }

    val redisConfig = RedisConfig(
        host = redisHost,
        port = redisPort
    )

    return Env(
        serverConfig = serverConfig,
        dbConfig = dbConfig,
        malCredentials = malCredentials,
        redisConfig = redisConfig
    )
}