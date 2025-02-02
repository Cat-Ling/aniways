package xyz.aniways.features.anime.dao

import org.ktorm.dsl.batchInsert
import org.ktorm.dsl.eq
import org.ktorm.dsl.inList
import org.ktorm.entity.*
import xyz.aniways.database.AniwaysDB
import xyz.aniways.features.anime.db.Anime
import xyz.aniways.features.anime.db.AnimeTable
import xyz.aniways.features.anime.db.animes
import xyz.aniways.models.PageInfo
import xyz.aniways.models.Pagination
import java.util.*
import kotlin.math.ceil

class DbAnimeDao(
    private val aniwaysDb: AniwaysDB
) : AnimeDao {
    override suspend fun getAnimeCount(): Int {
        return aniwaysDb.query {
            animes.count()
        }
    }

    override suspend fun getRecentlyUpdatedAnimes(page: Int, itemsPerPage: Int): Pagination<Anime> {
        return aniwaysDb.query {
            val totalItems = animes.count()
            val totalPage = ceil(totalItems.toDouble() / itemsPerPage).toInt()
            val hasNextPage = page < totalPage
            val hasPreviousPage = page > 1

            val items = animes
                .sortedByDescending { it.updatedAt }
                .drop((page - 1) * itemsPerPage)
                .take(itemsPerPage)
                .toList()

            Pagination(
                pageInfo = PageInfo(
                    totalPage = totalPage,
                    currentPage = page,
                    hasNextPage = hasNextPage,
                    hasPreviousPage = hasPreviousPage
                ),
                items = items
            )
        }
    }

    override suspend fun getAnimeById(id: String): Anime? {
        return aniwaysDb.query {
            animes.find { it.id eq UUID.fromString(id) }
        }
    }

    override suspend fun getAnimesInMalIds(malIds: List<Int>): List<Anime> {
        return aniwaysDb.query {
            animes.filter { it.malId inList malIds }.toList()
        }
    }

    override suspend fun getAnimesInHiAnimeIds(hiAnimeIds: List<String>): List<Anime> {
        return aniwaysDb.query {
            animes.filter { it.hianimeId inList hiAnimeIds }.toList()
        }
    }

    override suspend fun insertAnime(anime: Anime): Anime {
        return aniwaysDb.query {
            animes.add(anime)
            animes.find { it.hianimeId eq anime.hianimeId }!!
        }
    }

    override suspend fun insertAnimes(animes: List<Anime>) {
        return aniwaysDb.query {
            batchInsert(AnimeTable) {
                for (anime in animes) {
                    item {
                        set(it.name, anime.name)
                        set(it.jname, anime.jname)
                        set(it.poster, anime.poster)
                        set(it.genre, anime.genre)
                        set(it.hianimeId, anime.hianimeId)
                        set(it.malId, anime.malId)
                        set(it.anilistId, anime.anilistId)
                        set(it.lastEpisode, anime.lastEpisode)
                    }
                }
            }
        }
    }

    override suspend fun updateAnime(anime: Anime): Anime {
        return aniwaysDb.query {
            animes.update(anime)
            anime
        }
    }
}