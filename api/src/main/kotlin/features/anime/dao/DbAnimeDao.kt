package xyz.aniways.features.anime.dao

import org.ktorm.dsl.*
import org.ktorm.entity.*
import org.ktorm.support.postgresql.ilike
import xyz.aniways.database.AniwaysDB
import xyz.aniways.features.anime.db.*
import xyz.aniways.models.PageInfo
import xyz.aniways.models.Pagination
import java.sql.ResultSet
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

    override suspend fun getAllGenres(): List<String> {
        return aniwaysDb.query {
            animes.map { it.genre.split(", ") }.flatten().distinct()
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

    override suspend fun getAnimesByGenre(genre: String, page: Int, itemsPerPage: Int): Pagination<Anime> {
        return aniwaysDb.query {
            val totalItems = animes.filter { it.genre like "%$genre%" }.count()
            val totalPage = ceil(totalItems.toDouble() / itemsPerPage).toInt()
            val hasNextPage = page < totalPage
            val hasPreviousPage = page > 1

            val items = animes
                .filter { it.genre like "%$genre%" }
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

    override suspend fun getRandomAnime(): Anime {
        return aniwaysDb.query {
            animes.toList().random()
        }
    }

    override suspend fun getRandomAnimeByGenre(genre: String): Anime {
        return aniwaysDb.query {
            animes.filter { it.genre like "%$genre%" }.toList().random()
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

    override suspend fun searchAnimes(
        query: String,
        page: Int,
        itemsPerPage: Int
    ): Pagination<Anime> {
        return aniwaysDb.query {
            useConnection { conn ->
                val searchQuery = """
                    SELECT 
                        *,
                        ts_rank(search_vector, plainto_tsquery('english', ?)) AS rank
                    FROM 
                        animes
                    WHERE 
                        name % ? 
                        OR jname % ?
                        OR search_vector @@ plainto_tsquery('english', ?)
                    ORDER BY 
                        rank DESC
                    LIMIT ? 
                    OFFSET ?
                """.trimIndent()

                val countQuery = """
                    SELECT 
                        COUNT(*) 
                    FROM 
                        animes 
                    WHERE 
                        name % ? 
                        OR jname % ? 
                        OR search_vector @@ plainto_tsquery('english', ?)
                """.trimIndent()

                val totalItems = conn
                    .prepareStatement(countQuery)
                    .apply {
                        setString(1, query)
                        setString(2, query)
                        setString(3, query)
                    }
                    .executeQuery()
                    .let { rs ->
                        rs.next()
                        rs.getInt(1)
                    }

                val totalPage = ceil(totalItems.toDouble() / itemsPerPage).toInt()
                val hasNextPage = page < totalPage
                val hasPreviousPage = page > 1

                val items = conn
                    .prepareStatement(searchQuery)
                    .apply {
                        setString(1, query)
                        setString(2, query)
                        setString(3, query)
                        setString(4, query)
                        setInt(5, itemsPerPage)
                        setInt(6, (page - 1) * itemsPerPage)
                    }
                    .executeQuery()
                    .let { rs ->
                        generateSequence {
                            if (!rs.next()) return@generateSequence null
                            Anime {
                                id = UUID.fromString(rs.getString("id"))
                                name = rs.getString("name")
                                jname = rs.getString("jname")
                                poster = rs.getString("poster")
                                genre = rs.getString("genre")
                                hianimeId = rs.getString("hi_anime_id")
                                malId = rs.getInt("mal_id")
                                anilistId = rs.getInt("anilist_id")
                                lastEpisode = rs.getInt("last_episode")
                            }
                        }.toList()
                    }

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
    }

    override suspend fun insertAnime(anime: Anime): Anime {
        return aniwaysDb.query {
            animes.add(anime)
            animes.find { it.hianimeId eq anime.hianimeId }!!
        }
    }

    override suspend fun insertAnimeMetadata(animeMetadata: AnimeMetadata): AnimeMetadata {
        return aniwaysDb.query {
            this.animeMetadata.add(animeMetadata)
            animeMetadata
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

    override suspend fun updateAnimeMetadata(animeMetadata: AnimeMetadata): AnimeMetadata {
        return aniwaysDb.query {
            this.animeMetadata.update(animeMetadata)
            animeMetadata
        }
    }
}