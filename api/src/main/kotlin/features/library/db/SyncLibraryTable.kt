package xyz.aniways.features.library.db

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import org.ktorm.database.Database
import org.ktorm.entity.Entity
import org.ktorm.entity.sequenceOf
import org.ktorm.schema.Table
import org.ktorm.schema.enum
import org.ktorm.schema.timestamp
import org.ktorm.schema.varchar
import xyz.aniways.features.auth.db.Provider
import java.time.Instant

@Serializable
enum class SyncStatus {
    @SerialName("completed")
    COMPLETED,

    @SerialName("syncing")
    SYNCING,

    @SerialName("failed")
    FAILED
}

interface SyncLibraryEntity : Entity<SyncLibraryEntity> {
    var id: String
    var userId: String
    var provider: Provider
    var syncStatus: SyncStatus
    var createdAt: Instant
    var updatedAt: Instant

    companion object : Entity.Factory<SyncLibraryEntity>()
}

object SyncLibraryTable: Table<SyncLibraryEntity>("sync_library") {
    val id = varchar("id").primaryKey().bindTo { it.id }
    val userId = varchar("user_id").bindTo { it.userId }
    val provider = enum<Provider>("provider").bindTo { it.provider }
    val syncStatus = enum<SyncStatus>("sync_status").bindTo { it.syncStatus }
    val createdAt = timestamp("created_at").bindTo { it.createdAt }
    val updatedAt = timestamp("updated_at").bindTo { it.updatedAt }
}

val Database.syncLibrary get() = this.sequenceOf(SyncLibraryTable)