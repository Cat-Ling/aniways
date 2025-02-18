package xyz.aniways.features.auth.daos

import org.ktorm.dsl.eq
import org.ktorm.entity.add
import org.ktorm.entity.find
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.auth.db.TokenEntity
import xyz.aniways.features.auth.db.tokens
import java.time.Instant

interface TokenDao {
    suspend fun getToken(token: String): TokenEntity?
    suspend fun createToken(
        userId: String,
        token: String,
        refreshToken: String,
        provider: String,
        expiresAt: Instant
    ): String

    suspend fun deleteToken(token: String)
}

class DbTokenDao(
    private val db: AniwaysDatabase
) : TokenDao {
    override suspend fun getToken(token: String): TokenEntity? {
        return db.query {
            val tokenEntity = tokens.find { it.token eq token }
            tokenEntity?.expiresAt?.let {
                if (it.toEpochMilli() < System.currentTimeMillis()) {
                    tokenEntity.delete()
                    return@query null
                }
            }
            tokenEntity
        }
    }

    override suspend fun createToken(
        userId: String,
        token: String,
        refreshToken: String,
        provider: String,
        expiresAt: Instant,
    ): String {
        return db.query {
            val tokenEntity = TokenEntity {
                this.userId = userId
                this.token = token
                this.refreshToken = refreshToken
                this.provider = provider
                this.expiresAt = expiresAt
            }
            tokens.add(tokenEntity)
            tokenEntity.id
        }
    }

    override suspend fun deleteToken(token: String) {
        db.query {
            tokens.find { it.token eq token }?.delete()
        }
    }
}