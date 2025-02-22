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
import xyz.aniways.models.PageInfo
import xyz.aniways.models.Pagination

interface HistoryDao {
    suspend fun getHistoryAnime(userId: String, animeId: String): HistoryEntity?
    suspend fun getHistory(userId: String, page: Int, itemsPerPage: Int): Pagination<HistoryEntity>
    suspend fun saveToHistory(userId: String, animeId: String, watchedEpisodes: Int)
    suspend fun deleteFromHistory(userId: String, animeId: String)
}

class DBHistoryDao(
    private val db: AniwaysDatabase
) : HistoryDao {
    override suspend fun getHistoryAnime(userId: String, animeId: String): HistoryEntity? {
        return db.query {
            history.find { (it.userId eq userId) and (it.animeId eq animeId) }
        }
    }

    override suspend fun getHistory(userId: String, page: Int, itemsPerPage: Int): Pagination<HistoryEntity> {
        return db.query {
            val totalItems = history.count { it.userId eq userId }
            val items = history.filter { it.userId eq userId }
                .drop((page - 1) * itemsPerPage)
                .take(itemsPerPage)
                .toList()

            Pagination(
                items = items,
                pageInfo = PageInfo(
                    hasNextPage = totalItems > page * itemsPerPage,
                    totalPage = totalItems / itemsPerPage + 1,
                    currentPage = page,
                    hasPreviousPage = page > 1,
                )
            )
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