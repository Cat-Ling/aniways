package xyz.aniways.features.user.dao

import xyz.aniways.features.user.db.User
import xyz.aniways.features.user.models.CreateOrUpdateUserRequest

/**
 * Data access object for user data
 * Essentially only used as a cache for mal user data
 */
interface UserDao {
    /*
    * Only used to get their own account details
    * */
    suspend fun getUserById(id: Int): User?

    /*
    * Only used to create a new account when a user logs in for the first time
    * */
    suspend fun createUser(user: CreateOrUpdateUserRequest)

    /*
    * Only called when we log in and got different data
    * */
    suspend fun updateUser(user: CreateOrUpdateUserRequest)
}
