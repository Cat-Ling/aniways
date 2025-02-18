package xyz.aniways.features.users.dao

import xyz.aniways.features.users.db.UserEntity
import xyz.aniways.features.users.dtos.UpdateUserDto

interface UserDao {
    suspend fun getUserById(id: String): UserEntity?
    suspend fun getUserByEmail(email: String): UserEntity?
    suspend fun createUser(user: UserEntity): UserEntity
    suspend fun updateUser(id: String, updateUserBody: UpdateUserDto): UserEntity
    suspend fun deleteUser(id: String): Boolean
}