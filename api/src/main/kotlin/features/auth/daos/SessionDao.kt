package xyz.aniways.features.auth.daos

import org.ktorm.dsl.eq
import org.ktorm.entity.add
import org.ktorm.entity.find
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.auth.db.SessionEntity
import xyz.aniways.features.auth.db.sessions
import java.time.Instant

interface SessionDao {
    suspend fun getSession(sessionId: String): SessionEntity?
    suspend fun createSession(userId: String): String
    suspend fun deleteSession(sessionId: String)
}

class DbSessionDao(
    private val db: AniwaysDatabase
) : SessionDao {
    override suspend fun getSession(sessionId: String): SessionEntity? {
        return db.query { sessions.find { it.id eq sessionId } }
    }

    override suspend fun createSession(userId: String): String {
        return db.query {
            val session = SessionEntity {
                this.userId = userId
                this.expiresAt = Instant.now().plusSeconds(60 * 60 * 24 * 30) // 30 days
            }
            sessions.add(session)
            session.id
        }
    }

    override suspend fun deleteSession(sessionId: String) {
        db.query {
            sessions.find { it.id eq sessionId }?.delete()
        }
    }
}