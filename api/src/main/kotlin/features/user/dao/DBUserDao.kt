package xyz.aniways.features.user.dao

import org.ktorm.database.Database
import org.ktorm.dsl.*
import org.ktorm.entity.add
import org.ktorm.entity.find
import org.ktorm.entity.removeIf
import xyz.aniways.features.user.db.UserEntity
import xyz.aniways.features.user.db.UserTable
import xyz.aniways.features.user.db.users
import xyz.aniways.features.user.exceptions.UserNotFoundException
import xyz.aniways.features.user.models.CreateUserRequest
import xyz.aniways.features.user.models.UpdateUserRequest
import java.util.*

class DBUserDao(
    private val db: Database
) : UserDao {
    override suspend fun getUserById(id: String): UserEntity? {
        return try {
            db.from(UserTable)
                .select()
                .where { UserTable.id eq UUID.fromString(id) }
                .map { row -> UserTable.createEntity(row) }
                .first()
        } catch (e: NoSuchElementException) {
            null
        }
    }

    override suspend fun createUser(user: CreateUserRequest) {
        val entity = UserEntity {
            malId = user.malId
            username = user.username
            picture = user.picture
            gender = user.gender
        }

        db.users.add(entity)
    }

    override suspend fun updateUser(user: UpdateUserRequest) {
        val entity = db.users.find {
            it.id eq UUID.fromString(user.id)
        } ?: throw UserNotFoundException(user.id)

        entity.apply {
            username = user.username
            picture = user.picture
        }

        entity.flushChanges()
    }

    override suspend fun deleteUser(id: String) {
        db.users.removeIf { it.id eq UUID.fromString(id) }
    }
}