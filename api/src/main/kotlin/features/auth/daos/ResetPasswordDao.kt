package xyz.aniways.features.auth.daos

import org.ktorm.dsl.and
import org.ktorm.dsl.eq
import org.ktorm.dsl.gt
import org.ktorm.entity.add
import org.ktorm.entity.find
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.auth.db.ResetPasswordEntity
import xyz.aniways.features.auth.db.resetPasswords
import java.time.Instant
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

interface ResetPasswordDao {
    suspend fun createResetPasswordToken(userId: String): String
    suspend fun getUserIdByResetPasswordToken(token: String): String?
    suspend fun deleteResetPasswordToken(token: String)
}

class DbResetPasswordDao(
    private val db: AniwaysDatabase
) : ResetPasswordDao {
    override suspend fun createResetPasswordToken(userId: String): String {
        return db.query {
            val token = ResetPasswordEntity {
                this.userId = userId
                this.expiresAt = Instant.now().plusSeconds(15.minutes.inWholeSeconds)
                this.createdAt = Instant.now()
            }
            resetPasswords.add(token)
            token.token
        }
    }

    override suspend fun getUserIdByResetPasswordToken(token: String): String? {
        return db.query {
            resetPasswords.find {
                it.token eq token and(it.expiresAt gt Instant.now())
            }?.userId
        }
    }

    override suspend fun deleteResetPasswordToken(token: String) {
        db.query {
            resetPasswords.find { it.token eq token }?.delete()
        }
    }
}