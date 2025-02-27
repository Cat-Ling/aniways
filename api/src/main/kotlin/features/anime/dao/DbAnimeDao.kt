package xyz.aniways.features.anime.dao

import org.ktorm.dsl.*
import org.ktorm.entity.*
import xyz.aniways.database.AniwaysDatabase
import xyz.aniways.features.anime.db.*
import xyz.aniways.models.PageInfo
import xyz.aniways.models.Pagination
import kotlin.math.ceil

class DbAnimeDao(
    private val aniwaysDatabase: AniwaysDatabase
) : AnimeDao {
    override suspend fun getAnimeCount(): Int {
        return aniwaysDatabase.query {
            animes.count()
        }
    }

    override suspend fun getAllGenres(): List<String> {
        return aniwaysDatabase.query {
            animes.map { it.genre.split(", ") }.flatten().distinct()
        }
    }

    override suspend fun getRecentlyUpdatedAnimes(page: Int, itemsPerPage: Int): Pagination<Anime> {
        return aniwaysDatabase.query {
            val totalItems = animes.count()
            val totalPage = ceil(totalItems.toDouble() / itemsPerPage).toInt()
            val hasNextPage = page < totalPage
            val hasPreviousPage = page > 1

            val items = animes
                .filter { it.malId.isNotNull() or it.malId.notEq(0) }
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
        return aniwaysDatabase.query {
            val totalItems = animes.filter { it.genre like "%$genre%" }.count()
            val totalPage = ceil(totalItems.toDouble() / itemsPerPage).toInt()
            val hasNextPage = page < totalPage
            val hasPreviousPage = page > 1

            val items = animes
                .filter { it.genre like "%$genre%" and (it.malId.isNotNull() or it.malId.notEq(0)) }
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
        return aniwaysDatabase.query {
            animes.filter { it.malId.isNotNull() }.toList().random()
        }
    }

    override suspend fun getRandomAnimeByGenre(genre: String): Anime {
        return aniwaysDatabase.query {
            animes.filter { it.malId.isNotNull().and(it.genre like "%$genre%") }.toList().random()
        }
    }

    override suspend fun getAnimeById(id: String): Anime? {
        return aniwaysDatabase.query {
            animes.find { it.id eq id }
        }
    }

    override suspend fun getAnimesInMalIds(malIds: List<Int>): List<Anime> {
        if (malIds.isEmpty()) return emptyList()
        return aniwaysDatabase.query {
            animes.filter { it.malId inList malIds }.toList()
        }
    }

    override suspend fun getAnimesInHiAnimeIds(hiAnimeIds: List<String>): List<Anime> {
        if (hiAnimeIds.isEmpty()) return emptyList()
        return aniwaysDatabase.query {
            animes.filter { it.hianimeId inList hiAnimeIds }.toList()
        }
    }

    override suspend fun searchAnimes(
        query: String,
        genre: String?,
        page: Int,
        itemsPerPage: Int
    ): Pagination<Anime> {
        return aniwaysDatabase.query {
            useConnection { conn ->
                val conditions = mutableListOf<String>()
                val params = mutableListOf<Any>()

                if (query.isNotBlank()) {
                    conditions.add(
                        """
                        (name % ?
                        OR jname % ?
                        OR search_vector @@ plainto_tsquery('english', ?))
                    """.trimIndent()
                    )
                    params.add(query)
                    params.add(query)
                    params.add(query)
                }

                if (!genre.isNullOrBlank()) {
                    conditions.add("genre LIKE ?")
                    params.add("%$genre%")
                }

                conditions.add("mal_id IS NOT NULL")

                val whereClause = if (conditions.isNotEmpty()) {
                    "WHERE ${conditions.joinToString(" AND ")}"
                } else {
                    ""
                }

                val searchQuery = """
                    SELECT 
                        *,
                        ts_rank(search_vector, plainto_tsquery('english', ?)) AS query_rank
                    FROM 
                        animes
                    LEFT JOIN
                        anime_metadata ON animes.mal_id = anime_metadata.mal_id
                    $whereClause
                    ORDER BY 
                        query_rank DESC
                    LIMIT ? 
                    OFFSET ?
                """.trimIndent()

                val countQuery = """
                    SELECT 
                        COUNT(*) 
                    FROM 
                        animes 
                    $whereClause
                """.trimIndent()

                val totalItems = conn
                    .prepareStatement(countQuery)
                    .apply {
                        params.forEachIndexed { i, value ->
                            if (value::class == String::class) {
                                setString(i + 1, value as String)
                            } else if (value::class == Int::class) {
                                setInt(i + 1, value as Int)
                            }
                        }
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
                        params.forEachIndexed { i, value ->
                            if (value::class == String::class) {
                                setString(i + 2, value as String)
                            } else if (value::class == Int::class) {
                                setInt(i + 2, value as Int)
                            }
                            setInt(params.size + 2, itemsPerPage)
                            setInt(params.size + 3, (page - 1) * itemsPerPage)
                        }
                    }
                    .executeQuery()
                    .let { rs ->
                        generateSequence {
                            if (!rs.next()) return@generateSequence null
                            Anime {
                                id = rs.getString("id")
                                name = rs.getString("name")
                                jname = rs.getString("jname")
                                poster = rs.getString("poster")
                                this.genre = rs.getString("genre")
                                hianimeId = rs.getString("hi_anime_id")
                                malId = rs.getInt("mal_id")
                                anilistId = rs.getInt("anilist_id")
                                lastEpisode = rs.getInt("last_episode")
                                metadata = AnimeMetadata {
                                    malId = rs.getInt("mal_id")
                                    description = rs.getString("description")
                                    mainPicture = rs.getString("main_picture")
                                    mediaType = rs.getString("media_type")
                                    rating = rs.getString("rating")
                                    avgEpDuration = rs.getInt("avg_ep_duration")
                                    airingStatus = rs.getString("airing_status")
                                    totalEpisodes = rs.getInt("total_episodes")
                                    studio = rs.getString("studio")
                                    rank = rs.getInt("rank")
                                    mean = rs.getDouble("mean")
                                    scoringUsers = rs.getInt("scoring_users")
                                    popularity = rs.getInt("popularity")
                                    airingStart = rs.getString("airing_start")
                                    airingEnd = rs.getString("airing_end")
                                    source = rs.getString("source")
                                    trailer = rs.getString("trailer")
                                    createdAt = rs.getTimestamp("created_at").toInstant()
                                    lastUpdatedAt = rs.getTimestamp("last_updated_at")?.toInstant()
                                    seasonYear = rs.getInt("season_year")
                                    season = rs.getString("season")
                                }
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
        return aniwaysDatabase.query {
            animes.add(anime)
            animes.find { it.hianimeId eq anime.hianimeId }!!
        }
    }

    override suspend fun insertAnimeMetadata(animeMetadata: AnimeMetadata): AnimeMetadata {
        return aniwaysDatabase.query {
            this.animeMetadata.add(animeMetadata)
            animeMetadata
        }
    }

    override suspend fun insertAnimes(animes: List<Anime>) {
        return aniwaysDatabase.query {
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
        return aniwaysDatabase.query {
            animes.update(anime)
            anime
        }
    }

    override suspend fun updateAnimeMetadata(animeMetadata: AnimeMetadata): AnimeMetadata {
        return aniwaysDatabase.query {
            this.animeMetadata.update(animeMetadata)
            animeMetadata
        }
    }

    override suspend fun getAnimesWithoutMetadata(): List<Anime> {
        return aniwaysDatabase.query {
            from(AnimeTable)
                .leftJoin(AnimeMetadataTable, AnimeTable.malId eq AnimeMetadataTable.malId)
                .select(AnimeTable.columns)
                .where {
                    AnimeTable.malId.isNotNull()
                        .and(AnimeMetadataTable.malId.isNull() or AnimeMetadataTable.malId.eq(0))
                }
                .map { AnimeTable.createEntity(it) }
        }
    }
}