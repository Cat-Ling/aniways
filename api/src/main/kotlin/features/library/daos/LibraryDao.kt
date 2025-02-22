package xyz.aniways.features.library.daos

import org.ktorm.dsl.and
import org.ktorm.dsl.eq
import org.ktorm.dsl.insert
import org.ktorm.dsl.update
import org.ktorm.entity.*
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.library.db.LibraryEntity
import xyz.aniways.features.library.db.LibraryStatus
import xyz.aniways.features.library.db.LibraryTable
import xyz.aniways.features.library.db.library

interface LibraryDao {
    suspend fun getLibrary(userId: String, page: Int, itemsPerPage: Int, status: LibraryStatus): List<LibraryEntity>
    suspend fun saveToLibrary(userId: String, animeId: String, status: LibraryStatus, epNo: Int? = null)
    suspend fun deleteFromLibrary(userId: String, animeId: String)
}

class DBLibraryDao(
    private val db: AniwaysDatabase
) : LibraryDao {
    override suspend fun getLibrary(
        userId: String,
        page: Int,
        itemsPerPage: Int,
        status: LibraryStatus
    ): List<LibraryEntity> {
        return db.query {
            if (status == LibraryStatus.ALL) {
                library.filter { it.userId eq userId }
                    .drop((page - 1) * itemsPerPage)
                    .take(itemsPerPage)
                    .toList()
            } else {
                library.filter { (it.userId eq userId) and (it.status eq status) }
                    .drop((page - 1) * itemsPerPage)
                    .take(itemsPerPage)
                    .toList()
            }
        }
    }

    override suspend fun saveToLibrary(userId: String, animeId: String, status: LibraryStatus, epNo: Int?) {
        db.query {
            val alreadyInDB = library.find { (it.userId eq userId) and (it.animeId eq animeId) }

            if (alreadyInDB != null) {
                update(LibraryTable) { row ->
                    set(row.status, status)
                    set(row.watchedEpisodes, epNo ?: 0)
                    where {
                        (row.userId eq userId) and (row.animeId eq animeId)
                    }
                }
                return@query
            }

            insert(LibraryTable) {
                set(it.animeId, animeId)
                set(it.userId, userId)
                set(it.status, status)
                set(it.watchedEpisodes, epNo ?: 0)
            }
        }
    }

    override suspend fun deleteFromLibrary(userId: String, animeId: String) {
        db.query {
            library.find { (it.userId eq userId) and (it.animeId eq animeId) }?.delete()
        }
    }
}