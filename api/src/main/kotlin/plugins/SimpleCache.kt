package xyz.aniways.plugins

import com.ucasoft.ktor.simpleCache.SimpleCache
import com.ucasoft.ktor.simpleCache.cacheOutput
import com.ucasoft.ktor.simpleRedisCache.redisCache
import io.ktor.server.application.*
import io.ktor.server.routing.*
import xyz.aniways.env
import xyz.aniways.isDev
import kotlin.time.Duration

fun Application.configureSimpleCache() {
    install(SimpleCache) {
        redisCache {
            host = env.redisConfig.host
            port = env.redisConfig.port
        }
    }
}

fun Route.cache(
    invalidateAt: Duration? = null,
    queryKeys: List<String> = emptyList(),
    build: Route.() -> Unit
) {
    if(application.isDev) {
        application.log.info("Cache is disabled in development mode")
        return build()
    }

    cacheOutput(invalidateAt, queryKeys, build)
}

