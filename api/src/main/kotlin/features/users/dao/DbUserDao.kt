package xyz.aniways.features.users.dao

import org.ktorm.dsl.eq
import org.ktorm.entity.find
import org.ktorm.support.postgresql.insertReturning
import org.postgresql.util.PSQLException
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.users.db.UserEntity
import xyz.aniways.features.users.db.UserTable
import xyz.aniways.features.users.db.users
import xyz.aniways.features.users.dtos.UpdateUserDto

class UserNotFoundException(message: String) : Exception(message)
class UserUniqueConstraintException(message: String) : Exception(message)

class DbUserDao(
    private val db: AniwaysDatabase
) : UserDao {
    override suspend fun getUserById(id: String): UserEntity {
        return db.query { users.find { it.id eq id } } ?: throw UserNotFoundException("User not found")
    }

    override suspend fun getUserByEmail(email: String): UserEntity {
        return db.query { users.find { it.email eq email } } ?: throw UserNotFoundException("User not found")
    }

    override suspend fun createUser(user: UserEntity): UserEntity {
        return db.query {
            try {
                val id = insertReturning(UserTable, UserTable.id) {
                    set(it.username, user.username)
                    set(it.email, user.email)
                    set(it.passwordHash, user.passwordHash)
                    set(it.profilePicture, user.profilePicture)
                }
                id ?: throw Exception("Failed to create user")
                users.find { it.id.eq(id) } ?: throw Exception("Failed to create user")
            } catch (e: PSQLException) {
                if (e.sqlState == "23505") {
                    val uniqueKey = e.message?.substringAfter("Key (")?.substringBefore(")")
                    throw UserUniqueConstraintException("User with $uniqueKey already exists")
                } else {
                    throw e
                }
            }
        }
    }

    override suspend fun updateUser(id: String, updateUserBody: UpdateUserDto): UserEntity {
        return db.query {
            try {
                val user = users.find { it.id eq id } ?: throw UserNotFoundException("User not found")

                updateUserBody.email?.let { user.email = it }
                updateUserBody.username?.let { user.username = it }
                updateUserBody.profilePicture?.let { user.profilePicture = it }
                updateUserBody.password?.let { user.passwordHash = it }

                user.flushChanges()

                user
            } catch (e: PSQLException) {
                if (e.sqlState == "23505") {
                    val uniqueKey = e.message?.substringAfter("Key (")?.substringBefore(")")
                    throw UserUniqueConstraintException("User with $uniqueKey already exists")
                } else {
                    throw e
                }
            }
        }
    }

    override suspend fun deleteUser(id: String): Boolean {
        return db.query {
            val rowsAffected = users.find { it.id eq id }?.delete() ?: 0
            rowsAffected > 0
        }
    }
}