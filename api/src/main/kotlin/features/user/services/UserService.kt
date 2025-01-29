package xyz.aniways.features.user.services

import org.ktorm.database.Database
import xyz.aniways.features.user.dao.SettingsDao
import xyz.aniways.features.user.dao.UserDao
import xyz.aniways.features.user.db.Settings
import xyz.aniways.features.user.models.CreateOrUpdateUserRequest
import xyz.aniways.utils.TransactionService

class UserService(
    private val transactionService: TransactionService,
    private val userDao: UserDao,
    private val settingsDao: SettingsDao,
) {
    suspend fun getUserById(id: Int) = userDao.getUserById(id)

    suspend fun getSettingsByUserId(userId: Int) = settingsDao.getSettings(userId)

    suspend fun createUser(malId: Int, username: String, picture: String?) {
        transactionService.useTransaction {
            userDao.createUser(
                CreateOrUpdateUserRequest(
                    malId = malId,
                    username = username,
                    picture = picture,
                )
            )

            settingsDao.saveSettings(
                Settings {
                    userId = malId
                    autoUpdateMal = false
                    autoNextEpisode = true
                    autoPlayEpisode = true
                }
            )
        }
    }

    suspend fun updateUser(malId: Int, username: String, picture: String?) {
        userDao.updateUser(
            CreateOrUpdateUserRequest(
                malId = malId,
                username = username,
                picture = picture,
            )
        )
    }

    suspend fun updateSettings(
        userId: Int,
        autoUpdateMal: Boolean,
        autoNextEpisode: Boolean,
        autoPlayEpisode: Boolean
    ) {
        settingsDao.saveSettings(
            Settings {
                this.userId = userId
                this.autoUpdateMal = autoUpdateMal
                this.autoNextEpisode = autoNextEpisode
                this.autoPlayEpisode = autoPlayEpisode
            }
        )
    }
}