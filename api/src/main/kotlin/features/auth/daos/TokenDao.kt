package xyz.aniways.features.auth.daos

import org.ktorm.dsl.and
import org.ktorm.dsl.eq
import org.ktorm.entity.add
import org.ktorm.entity.filter
import org.ktorm.entity.find
import org.ktorm.entity.map
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.auth.db.TokenEntity
import xyz.aniways.features.auth.db.tokens
import java.time.Instant

interface TokenDao {
    suspend fun getProviders(userId: String): List<String>
    suspend fun getToken(userId: String, provider: String): TokenEntity?
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
    override suspend fun getProviders(userId: String): List<String> {
        return db.query {
            tokens.filter { it.userId eq userId }.map { it.provider }.distinct()
        }
    }

    override suspend fun getToken(userId: String, provider: String): TokenEntity? {
        return db.query {
            val token = tokens.find { it.userId eq userId and (it.provider eq provider) }
            token?.expiresAt?.let {
                if (it.isAfter(Instant.now())) {
                    token
                } else {
                    token.delete()
                    null
                }
            }
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