package xyz.aniways.features.library.daos

import org.ktorm.dsl.eq
import org.ktorm.dsl.update
import org.ktorm.entity.filter
import org.ktorm.entity.find
import org.ktorm.entity.toList
import org.ktorm.support.postgresql.insertReturning
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.auth.db.Provider
import xyz.aniways.features.library.db.SyncLibraryEntity
import xyz.aniways.features.library.db.SyncLibraryTable
import xyz.aniways.features.library.db.SyncStatus
import xyz.aniways.features.library.db.syncLibrary

interface SyncLibraryDao {
    suspend fun getAllPastSyncsOfUser(userId: String): List<SyncLibraryEntity>
    suspend fun getSyncLibrary(id: String): SyncLibraryEntity?
    suspend fun getRunningSyncsOfUser(userId: String): List<SyncLibraryEntity>
    suspend fun insertSyncLibrary(userId: String, provider: Provider): String
    suspend fun updateSyncLibrary(id: String, syncStatus: SyncStatus)
    suspend fun deleteSyncLibrary(userId: String)
}

class DBSyncLibraryDao(
    private val db: AniwaysDatabase
) : SyncLibraryDao {
    override suspend fun getAllPastSyncsOfUser(userId: String): List<SyncLibraryEntity> {
        return db.query {
            syncLibrary.filter { it.userId eq userId }.toList()
        }
    }

    override suspend fun getSyncLibrary(id: String): SyncLibraryEntity? {
        return db.query {
            syncLibrary.find { it.id eq id }
        }
    }

    override suspend fun getRunningSyncsOfUser(userId: String): List<SyncLibraryEntity> {
        return db.query {
            syncLibrary
                .filter { it.userId eq userId }
                .filter { it.syncStatus eq SyncStatus.SYNCING }
                .toList()
        }
    }

    override suspend fun insertSyncLibrary(userId: String, provider: Provider): String {
        return db.query {
            val id = insertReturning(SyncLibraryTable, SyncLibraryTable.id) {
                set(it.userId, userId)
                set(it.provider, provider)
            }

            id ?: throw IllegalStateException("Failed to insert sync library")
        }
    }

    override suspend fun updateSyncLibrary(id: String, syncStatus: SyncStatus) {
        return db.query {
            val rowCount = update(SyncLibraryTable) {
                set(it.syncStatus, syncStatus)
                where { it.id eq id }
            }

            if (rowCount == 0) {
                throw IllegalStateException("Failed to update sync library")
            }
        }
    }

    override suspend fun deleteSyncLibrary(userId: String) {
        return db.query {
            syncLibrary.find { it.userId eq userId }?.delete()
        }
    }

}