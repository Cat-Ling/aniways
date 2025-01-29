package xyz.aniways.features.user.dao

import xyz.aniways.features.user.db.UserEntity
import xyz.aniways.features.user.models.CreateUserRequest
import xyz.aniways.features.user.models.UpdateUserRequest

interface UserDao {
    /*
    * Only used to get their own account details
    * */
    suspend fun getUserById(id: String): UserEntity?
    suspend fun createUser(user: CreateUserRequest)
    suspend fun updateUser(user: UpdateUserRequest)
    suspend fun deleteUser(id: String)
}
