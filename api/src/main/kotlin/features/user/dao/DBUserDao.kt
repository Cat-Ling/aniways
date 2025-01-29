package xyz.aniways.features.user.dao

import org.ktorm.database.Database
import org.ktorm.dsl.*
import org.ktorm.entity.add
import org.ktorm.entity.find
import xyz.aniways.features.user.db.User
import xyz.aniways.features.user.db.UserTable
import xyz.aniways.features.user.db.users
import xyz.aniways.features.user.exceptions.UserNotFoundException
import xyz.aniways.features.user.models.CreateOrUpdateUserRequest

class DBUserDao(
    private val db: Database
) : UserDao {
    override suspend fun getUserById(id: Int): User? {
        return db.from(UserTable)
            .select()
            .where { UserTable.malId eq id }
            .map { row -> UserTable.createEntity(row) }
            .firstOrNull()
    }

    override suspend fun createUser(user: CreateOrUpdateUserRequest) {
        val entity = User {
            malId = user.malId
            username = user.username
            picture = user.picture
        }

        db.users.add(entity)
    }

    override suspend fun updateUser(user: CreateOrUpdateUserRequest) {
        val entity = db.users.find {
            it.malId eq user.malId
        } ?: throw UserNotFoundException(user.malId)

        entity.apply {
            username = user.username
            picture = user.picture
        }

        entity.flushChanges()
    }
}