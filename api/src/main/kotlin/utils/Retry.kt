package xyz.aniways.utils

import kotlinx.coroutines.delay

suspend fun <T> retryWithDelay(
    maxRetry: Int = 10,
    delayMillis: Long = 2000L,
    block: suspend () -> T
): T? {
    repeat(maxRetry) {
        runCatching { block() }
            .onFailure { e ->
                if (it == maxRetry - 1) {
                    throw e
                }
                delay(delayMillis)
            }
    }

    return null
}