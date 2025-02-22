package xyz.aniways.features.library.daos

import org.ktorm.dsl.and
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.dsl.update
import org.ktorm.entity.*
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.library.db.HistoryEntity
import xyz.aniways.features.library.db.HistoryTable
import xyz.aniways.features.library.db.history

interface HistoryDao {
    suspend fun getHistory(userId: String, page: Int, itemsPerPage: Int): List<HistoryEntity>
    suspend fun saveToHistory(userId: String, animeId: String, watchedEpisodes: Int)
    suspend fun deleteFromHistory(userId: String, animeId: String)
}

class DBHistoryDao(
    private val db: AniwaysDatabase
) : HistoryDao {
    override suspend fun getHistory(userId: String, page: Int, itemsPerPage: Int): List<HistoryEntity> {
        return db.query {
            history.filter { it.userId eq userId }
                .drop((page - 1) * itemsPerPage)
                .take(itemsPerPage)
                .toList()
        }
    }

    override suspend fun saveToHistory(userId: String, animeId: String, watchedEpisodes: Int) {
        db.query {
            val alreadyInDB = history.find { (it.userId eq userId) and (it.animeId eq animeId) }

            if (alreadyInDB != null) {
                update(HistoryTable) { row ->
                    set(row.watchedEpisodes, watchedEpisodes)
                    where {
                        (row.userId eq userId) and (row.animeId eq animeId)
                    }
                }
                return@query
            }

            insert(HistoryTable) {
                set(it.animeId, animeId)
                set(it.userId, userId)
                set(it.watchedEpisodes, watchedEpisodes)
            }
        }
    }

    override suspend fun deleteFromHistory(userId: String, animeId: String) {
        db.query {
            history.find { (it.userId eq userId) and (it.animeId eq animeId) }?.delete()
        }
    }
}