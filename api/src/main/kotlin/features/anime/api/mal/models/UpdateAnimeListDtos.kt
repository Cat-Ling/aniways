package xyz.aniways.features.anime.api.mal.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

enum class MalStatus(val value: String) {
    WATCHING("watching"),
    COMPLETED("completed"),
    ON_HOLD("on_hold"),
    DROPPED("dropped"),
    PLAN_TO_WATCH("plan_to_watch");

    companion object {
        fun fromValue(value: String): MalStatus? {
            return entries.firstOrNull { it.value == value }
        }
    }
}

@Serializable
data class UpdateAnimeListRequest(
    val status: String,
    val score: Int,
    @SerialName("num_watched_episodes")
    val numWatchedEpisodes: Int,
)