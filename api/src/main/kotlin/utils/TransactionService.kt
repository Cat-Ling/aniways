package xyz.aniways.utils

import org.ktorm.database.Database

class TransactionService(
    private val db: Database
) {
    suspend fun <T> useTransaction(block: suspend () -> T): T {
        return db.useTransaction {
            block()
        }
    }
}