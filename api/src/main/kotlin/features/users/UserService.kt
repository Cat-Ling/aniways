package xyz.aniways.features.users

import at.favre.lib.crypto.bcrypt.BCrypt
import io.ktor.server.plugins.*
import xyz.aniways.features.users.dao.UserDao
import xyz.aniways.features.users.db.UserEntity
import xyz.aniways.features.users.dtos.CreateUserDto
import xyz.aniways.features.users.dtos.UpdateUserDto
import xyz.aniways.features.users.dtos.UserDto
import xyz.aniways.features.users.dtos.toDto

class UnauthorizedException(message: String) : Exception(message)

class UserService(
    private val userDao: UserDao,
) {
    suspend fun getUserById(id: String): UserDto {
        val user = userDao.getUserById(id)
        user ?: throw NotFoundException("User not found")
        return user.toDto()
    }

    suspend fun createUser(user: CreateUserDto): UserDto {
        val userEntity = UserEntity {
            username = user.username
            email = user.email
            passwordHash = BCrypt.withDefaults().hashToString(12, user.password.toCharArray())
            profilePicture = user.profilePicture
        }

        return userDao.createUser(userEntity).toDto()
    }

    suspend fun updateUser(id: String, user: UpdateUserDto): UserDto {
        return userDao.updateUser(id, user.run {
            if (password != null) {
                copy(password = password)
            } else {
                this
            }
        }).toDto()
    }

    suspend fun deleteUser(id: String, email: String, password: String): Boolean {
        val user = this.authenticateUser(email, password)
        if (user.id != id) {
            throw UnauthorizedException("You are not authorized to delete this user")
        }
        return userDao.deleteUser(id)
    }

    suspend fun authenticateUser(email: String, password: String): UserDto {
        val user = userDao.getUserByEmail(email)
        user ?: throw NotFoundException("User not found")

        if (!BCrypt.verifyer().verify(password.toCharArray(), user.passwordHash).verified) {
            throw UnauthorizedException("Invalid password")
        }

        return user.toDto()
    }
}
