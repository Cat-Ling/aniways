package xyz.aniways.plugins

import com.ucasoft.ktor.simpleCache.SimpleCache
import com.ucasoft.ktor.simpleRedisCache.redisCache
import io.ktor.server.application.*
import xyz.aniways.env

fun Application.configureSimpleCache() {
    install(SimpleCache) {
        redisCache {
            host = env.redisConfig.host
            port = env.redisConfig.port
        }
    }
}