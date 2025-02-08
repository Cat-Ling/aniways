package xyz.aniways.plugins

import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import kotlin.time.Duration.Companion.seconds

fun Application.configureRateLimiting() {
    install(RateLimit) {
        register {
            rateLimiter(
                refillPeriod = 30.seconds,
                limit = 5,
            )
        }
    }
}
