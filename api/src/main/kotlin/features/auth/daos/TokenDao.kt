package xyz.aniways.features.auth.daos

import org.ktorm.dsl.and
import org.ktorm.dsl.eq
import org.ktorm.entity.add
import org.ktorm.entity.filter
import org.ktorm.entity.find
import org.ktorm.entity.mapNotNull
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.auth.db.Provider
import xyz.aniways.features.auth.db.TokenEntity
import xyz.aniways.features.auth.db.tokens
import java.time.Instant

interface TokenDao {
    suspend fun getInstalledProviders(userId: String): List<Provider>
    suspend fun getToken(userId: String, provider: Provider): TokenEntity?
    suspend fun createToken(
        userId: String,
        token: String,
        refreshToken: String,
        provider: Provider,
        expiresAt: Instant
    ): String

    suspend fun deleteToken(token: String)
}

class DbTokenDao(
    private val db: AniwaysDatabase
) : TokenDao {
    override suspend fun getInstalledProviders(userId: String): List<Provider> {
        return db.query {
            val tokens = tokens.filter { it.userId eq userId }
            tokens.mapNotNull { token ->
                token.expiresAt?.let {
                    if (it.isAfter(Instant.now())) {
                        token.provider
                    } else {
                        token.delete()
                        null
                    }
                }
            }
        }
    }

    override suspend fun getToken(userId: String, provider: Provider): TokenEntity? {
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
        provider: Provider,
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