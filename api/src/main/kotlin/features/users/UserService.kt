package xyz.aniways.features.users

import at.favre.lib.crypto.bcrypt.BCrypt
import com.cloudinary.Cloudinary
import com.cloudinary.utils.ObjectUtils
import io.ktor.server.plugins.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import xyz.aniways.Env
import xyz.aniways.features.users.dao.UserDao
import xyz.aniways.features.users.db.UserEntity
import xyz.aniways.features.users.dtos.*

class UnauthorizedException(message: String) : Exception(message)

class UserService(
    private val userDao: UserDao,
    private val cloudinaryConfig: Env.CloudinaryConfig,
) {
    suspend fun getUserById(id: String): UserDto {
        val user = userDao.getUserById(id)
        user ?: throw NotFoundException("User not found")
        return user.toDto()
    }

    suspend fun getUserByEmail(email: String): UserDto {
        val user = userDao.getUserByEmail(email)
        user ?: throw NotFoundException("User not found")
        return user.toDto()
    }

    suspend fun uploadImage(image: ByteArray): String {
        return withContext(Dispatchers.IO) {
            val cloudinary = Cloudinary(cloudinaryConfig.url)
            val response = cloudinary.uploader().upload(image, ObjectUtils.emptyMap())
            val url = response["secure_url"] as String?
            url ?: throw Exception("Failed to upload image")
        }
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
                copy(password = BCrypt.withDefaults().hashToString(12, password.toCharArray()))
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

    suspend fun updateUserPassword(userId: String, body: UpdatePasswordDto): UserDto {
        val email = this.getUserById(userId).email
        this.authenticateUser(email, body.oldPassword)
        return this.updateUser(userId, UpdateUserDto(password = body.newPassword))
    }

    suspend fun resetUserPassword(userId: String, password: String): UserDto {
        return this.updateUser(userId, UpdateUserDto(password = password))
    }
}
