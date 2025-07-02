package xyz.aniways

import io.ktor.server.application.*
import io.ktor.server.netty.*
import org.slf4j.LoggerFactory
import xyz.aniways.plugins.*

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    val logger = LoggerFactory.getLogger("AniwaysApp")

    try {
        logger.info("🚀 Starting Aniways application...")

        // 🔍 Log key environment info for visibility
        val server = env.serverConfig
        val db = env.dbConfig
        val redis = env.redisConfig

        logger.info("🌐 API Domain: ${server.apiDomain}")
        logger.info("🖥️ Frontend Domain: ${server.frontendDomain}")
        logger.info("🗄️ DB URL: ${db.url}")
        logger.info("🧠 Redis: ${redis.host}:${redis.port}")

        configureKoin()
        configureSerialization()
        configureMonitoring()
        configureTaskScheduler()
        configureSession()
        configureAuth()
        configureRouting()
        configureCors()
        configureStatusPage()

        logger.info("✅ Aniways application started successfully at ${env.serverConfig.apiUrl}")
    } catch (e: Exception) {
        logger.error("❌ Failed to start Aniways application", e)
        throw e
    }
}
