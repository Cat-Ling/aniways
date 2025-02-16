package xyz.aniways.features.settings.dtos

import kotlinx.serialization.Serializable
import xyz.aniways.features.settings.db.Settings

@Serializable
data class SettingsDto(
    val userId: Int,
    val autoNextEpisode: Boolean,
    val autoPlayEpisode: Boolean,
    val autoUpdateMal: Boolean,
    val autoResumeEpisode: Boolean,
) {
    fun toEntity() = Settings {
        userId = this@SettingsDto.userId
        autoNextEpisode = this@SettingsDto.autoNextEpisode
        autoPlayEpisode = this@SettingsDto.autoPlayEpisode
        autoUpdateMal = this@SettingsDto.autoUpdateMal
        autoResumeEpisode = this@SettingsDto.autoResumeEpisode
    }
}

fun Settings.toDto() = SettingsDto(
    userId = userId,
    autoNextEpisode = autoNextEpisode,
    autoPlayEpisode = autoPlayEpisode,
    autoUpdateMal = autoUpdateMal,
    autoResumeEpisode = autoResumeEpisode,
)