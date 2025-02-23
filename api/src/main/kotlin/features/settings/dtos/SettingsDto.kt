package xyz.aniways.features.settings.dtos

import kotlinx.serialization.Serializable
import xyz.aniways.features.settings.db.Settings

@Serializable
data class SettingsDto(
    val userId: String,
    val autoNextEpisode: Boolean,
    val autoPlayEpisode: Boolean,
    val autoResumeEpisode: Boolean,
    val incognitoMode: Boolean,
) {
    fun toEntity() = Settings {
        userId = this@SettingsDto.userId
        autoNextEpisode = this@SettingsDto.autoNextEpisode
        autoPlayEpisode = this@SettingsDto.autoPlayEpisode
        incognitoMode = this@SettingsDto.incognitoMode
        autoResumeEpisode = this@SettingsDto.autoResumeEpisode
    }
}

fun Settings.toDto() = SettingsDto(
    userId = userId,
    autoNextEpisode = autoNextEpisode,
    autoPlayEpisode = autoPlayEpisode,
    incognitoMode = incognitoMode,
    autoResumeEpisode = autoResumeEpisode,
)