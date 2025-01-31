package xyz.aniways.features.anime.scrapers

import io.ktor.client.*
import io.ktor.client.request.*
import org.jsoup.nodes.Document
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.dtos.SearchResultDto
import xyz.aniways.features.anime.dtos.TopAnimeDto
import xyz.aniways.features.anime.dtos.TopAnimeNodeDto
import xyz.aniways.features.anime.dtos.TrendingAnimeDto
import xyz.aniways.models.PageInfo
import xyz.aniways.models.Pagination
import xyz.aniways.utils.getDocument
import xyz.aniways.utils.toStringOrNull


class HianimeScraper(
    private val httpClient: HttpClient,
    private val dao: AnimeDao,
) : AnimeScraper {
    private val baseUrl = "https://hianime.to"

    override suspend fun getTrendingAnimes(): List<TrendingAnimeDto> {
        val document = httpClient.getDocument("$baseUrl/home")

        val selector = "#trending-home .swiper-wrapper .swiper-slide"
        return document.select(selector).map { element ->
            val hiAnimeId = element.select(".item .film-poster")
                .attr("href")
                .removePrefix("/")
                .trim()

            val rank = element.select(".item .number span").text()

            val titleElement = element.select(
                ".item .number .film-title.dynamic-name"
            )

            val name = titleElement.text().trim()
            val jname = titleElement.attr("data-jname").trim()

            val poster = element.select(".item .film-poster .film-poster-img")
                .attr("data-src")
                .trim()

            val id = dao.getAnimeByHiAnimeId(hiAnimeId)?.id.toStringOrNull()

            TrendingAnimeDto(
                id = id ?: hiAnimeId,
                hiAnimeId = hiAnimeId,
                name = name,
                jname = jname,
                poster = poster,
                rank = rank.toInt()
            )
        }
    }

    private suspend fun getTopAnimeNodes(
        document: Document,
        type: String
    ): List<TopAnimeNodeDto> {
        return document.select("#top-viewed-$type ul li").map { element ->
            val link = element.select(".film-detail .dynamic-name")

            val hiAnimeId = link.attr("href").removePrefix("/").trim()
            val name = link.text().trim()
            val jname = link.attr("data-jname").trim()

            val id = dao.getAnimeByHiAnimeId(hiAnimeId)?.id.toStringOrNull()
            val rank = element.select(".film-number span").text().toInt()

            val poster = element.select(".film-poster .film-poster-img")
                .attr("data-src")
                .trim()

            val episodes = element.select(".film-detail .fd-infor .tick-item.tick-sub")
                .text()
                .toInt()

            TopAnimeNodeDto(
                id = id,
                hiAnimeId = hiAnimeId,
                rank = rank,
                name = name,
                jname = jname,
                poster = poster,
                episodes = episodes
            )
        }
    }

    override suspend fun getTopAnimes(): TopAnimeDto {
        val document = httpClient.getDocument("$baseUrl/home")

        return TopAnimeDto(
            today = getTopAnimeNodes(document, "day"),
            week = getTopAnimeNodes(document, "week"),
            month = getTopAnimeNodes(document, "month")
        )
    }

    override suspend fun searchAnime(query: String, page: Int): Pagination<SearchResultDto> {
        val document = httpClient.getDocument("$baseUrl/search") {
            parameter("keyword", query)
            parameter("page", page)
        }

        val selector = "#main-content div.film_list-wrap > div.flw-item"
        val animes = document.select(selector).map { element ->
            val hianimeId = element.select(".film-poster a")
                .attr("href")
                .replace("/watch/", "")
                .trim()

            val id = dao.getAnimeByHiAnimeId(hianimeId)?.id.toStringOrNull()

            val link = element.select(".film-detail .film-name a")
            val name = link.text().trim()
            val jname = link.attr("data-jname").trim()

            val episodes = element.select(".film-poster .tick.ltr .tick-sub")
                .text()
                .trim()

            val poster = element.select(".film-poster img")
                .attr("data-src")
                .trim()

            SearchResultDto(
                id = id ?: hianimeId,
                hianimeId = hianimeId,
                name = name,
                jname = jname,
                episodes = episodes,
                poster = poster
            )
        }

        val pagination = document.select(".pagination")

        val lastPage = pagination.select("li")
            .last()
            ?.select("a")
            ?.attr("href")
            ?.split("page=")
            ?.last()
            ?.toInt() ?: 1

        return Pagination(
            pageInfo = PageInfo(
                totalPage = lastPage,
                currentPage = page,
                hasNextPage = page < lastPage,
                hasPreviousPage = page > 1
            ),
            items = animes
        )
    }
}
