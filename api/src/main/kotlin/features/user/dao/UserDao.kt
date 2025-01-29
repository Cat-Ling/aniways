package xyz.aniways.features.user.dao

import xyz.aniways.features.user.db.UserEntity
import xyz.aniways.features.user.models.CreateUserRequest
import xyz.aniways.features.user.models.UpdateUserRequest

/**
 * Data access object for user data
 * Essentially only used as a cache for mal user data
 */
interface UserDao {
    /*
    * Only used to get their own account details
    * */
    suspend fun getUserById(id: Int): UserEntity?

    /*
    * Only used to create a new account when a user logs in for the first time
    * */
    suspend fun createUser(user: CreateUserRequest)

    /*
    * Only called when we log in and got different data
    * */
    suspend fun updateUser(user: UpdateUserRequest)
}
