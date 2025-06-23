package xyz.aniways

import io.ktor.server.application.*
import io.ktor.util.logging.*
import java.io.File

class EnvNotFoundException(key: String) : Exception("Environment variable not found: $key")

/*
* Environment variables are loaded from the following sources:
* 1. Environment file: If the ENV_FILE environment variable is set, the file at the path specified by ENV_FILE is read.
* 2. System environment: If ENV_FILE is not set, the system environment variables are read.
* */
class Env {
    private val logger = KtorSimpleLogger("Env")

    private val envMap by lazy {
        val envFile = System.getenv("ENV_FILE")
        if (envFile != null) {
            logger.info("Loading environment variables from file: $envFile")
            File(envFile).readLines()
                .filter { it.isNotBlank() && !it.startsWith("#") }
                .map { it.split("=") }
                .associate { it[0] to it[1].replace("\"", "") }
        } else {
            logger.info("Loading environment variables from system environment")
            System.getenv()
        }
    }

    data class ServerConfig(
        val apiUrl: String,
        val frontendUrl: String,
        val apiDomain: String,
        val frontendDomain: String,
        val rootDomain: String,
    )

    val serverConfig by lazy {
        val apiUrl = envMap["API_URL"] ?: throw EnvNotFoundException("API_URL")
        val frontendUrl = envMap["FRONTEND_URL"] ?: throw EnvNotFoundException("FRONTEND_URL")

        fun extractDomain(url: String): String {
            return url.substringAfter("://").substringBefore("/")
        }

        fun extractRootDomain(url: String): String {
            val domain = extractDomain(url).split(":")[0]
            return if (domain.startsWith("localhost")) domain else domain.substringAfter(".")
        }

        ServerConfig(
            apiUrl = apiUrl,
            frontendUrl = frontendUrl,
            apiDomain = extractDomain(apiUrl),
            frontendDomain = extractDomain(frontendUrl),
            rootDomain = extractRootDomain(apiUrl)
        )
    }

    data class DBConfig(
        val url: String,
        val user: String,
        val password: String,
    )

    val dbConfig by lazy {
        val dbUrl = envMap["JDBC_POSTGRES_URL"] ?: throw EnvNotFoundException("JDBC_POSTGRES_URL")
        val dbUser = envMap["POSTGRES_USER"] ?: throw EnvNotFoundException("POSTGRES_USER")
        val dbPassword = envMap["POSTGRES_PASSWORD"] ?: throw EnvNotFoundException("POSTGRES_PASSWORD")

        DBConfig(
            url = dbUrl,
            user = dbUser,
            password = dbPassword
        )
    }

    data class MalCredentials(
        val clientId: String,
        val clientSecret: String,
    )

    val malCredentials by lazy {
        val clientId = envMap["MAL_CLIENT_ID"] ?: throw EnvNotFoundException("MAL_CLIENT_ID")
        val clientSecret = envMap["MAL_CLIENT_SECRET"] ?: throw EnvNotFoundException("MAL_CLIENT_SECRET")

        MalCredentials(
            clientId = clientId,
            clientSecret = clientSecret
        )
    }

    data class RedisConfig(
        val host: String,
        val port: Int,
    )

    val redisConfig by lazy {
        val redisHost = envMap["REDIS_HOST"] ?: throw EnvNotFoundException("REDIS_HOST")
        val redisPort = envMap["REDIS_PORT"]?.toIntOrNull() ?: throw EnvNotFoundException("REDIS_PORT")

        RedisConfig(
            host = redisHost,
            port = redisPort
        )
    }

    data class CloudinaryConfig(
        val url: String,
    )

    val cloudinaryConfig by lazy {
        val cloudinaryUrl = envMap["CLOUDINARY_URL"] ?: throw EnvNotFoundException("CLOUDINARY_URL")

        CloudinaryConfig(
            url = cloudinaryUrl
        )
    }

    data class ResendConfig(
        val apiKey: String,
        val fromEmail: String,
    )

    val resendConfig by lazy {
        val apiKey = envMap["RESEND_API_KEY"] ?: throw EnvNotFoundException("RESEND_API_KEY")
        val fromEmail = envMap["RESEND_FROM_EMAIL"] ?: throw EnvNotFoundException("RESEND_FROM_EMAIL")

        println(
            "Resend API Key: ${if (apiKey.isNotBlank()) "****" else "not set"}" +
            ", From Email: ${if (fromEmail.isNotBlank()) fromEmail else "not set"}"
        )

        ResendConfig(
            apiKey = apiKey,
            fromEmail = fromEmail
        )
    }
}

val Application.env by lazy { Env() }

val Application.isDev: Boolean
    get() =
        environment.config.propertyOrNull("ktor.development")?.toString() == "true" ||
        env.serverConfig.apiUrl.contains("localhost")
