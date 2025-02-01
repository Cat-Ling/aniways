package xyz.aniways.utils

import kotlinx.coroutines.delay

suspend fun <T> retryWithDelay(
    maxRetry: Int = 10,
    delayMillis: Long = 2000L,
    block: suspend () -> T
): T? {
    repeat(maxRetry) {
        try {
            return block()
        } catch (e: Exception) {
            delay(delayMillis)
        }
    }

    return null
}