package xyz.aniways.features.anime.scrapers

import io.ktor.client.*
import io.ktor.client.request.*
import org.jsoup.nodes.Document
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.dtos.*
import xyz.aniways.models.PageInfo
import xyz.aniways.models.Pagination
import xyz.aniways.utils.getDocument
import xyz.aniways.utils.toStringOrNull


class HianimeScraper(
    private val httpClient: HttpClient,
    private val dao: AnimeDao,
) : AnimeScraper {
    private val baseUrl = "https://hianime.to"

    override suspend fun getTrendingAnimes(): List<ScrapedAnimeDto> {
        val document = httpClient.getDocument("$baseUrl/home")

        val selector = "#trending-home .swiper-wrapper .swiper-slide"
        return document.select(selector).map { element ->
            val hianimeId = element.select(".item .film-poster")
                .attr("href")
                .removePrefix("/")
                .trim()

            val titleElement = element.select(
                ".item .number .film-title.dynamic-name"
            )

            val name = titleElement.text().trim()
            val jname = titleElement.attr("data-jname").trim()

            val poster = element.select(".item .film-poster .film-poster-img")
                .attr("data-src")
                .trim()

            val id = dao.getAnimeByHiAnimeId(hianimeId)?.id.toStringOrNull()

            ScrapedAnimeDto(
                id = id ?: hianimeId,
                hianimeId = hianimeId,
                name = name,
                jname = jname,
                poster = poster,
                episodes = "0",
            )
        }
    }

    private suspend fun getTopAnimeNodes(
        document: Document,
        type: String
    ): List<ScrapedAnimeDto> {
        return document.select("#top-viewed-$type ul li").map { element ->
            val link = element.select(".film-detail .dynamic-name")

            val hianimeId = link.attr("href").removePrefix("/").trim()
            val name = link.text().trim()
            val jname = link.attr("data-jname").trim()

            val id = dao.getAnimeByHiAnimeId(hianimeId)?.id.toStringOrNull()

            val poster = element.select(".film-poster .film-poster-img")
                .attr("data-src")
                .trim()

            val episodes = element.select(".film-detail .fd-infor .tick-item.tick-sub").text()

            ScrapedAnimeDto(
                id = id,
                hianimeId = hianimeId,
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

    private fun extractPageInfo(document: Document): PageInfo {
        val pagination = document.select(".pagination")

        val lastLink = pagination.select("li").last()

        val lastPage = if (lastLink?.hasClass("active") == true) {
            lastLink.text().toIntOrNull() ?: 1
        } else {
            lastLink?.select("a")
                ?.attr("href")
                ?.split("page=")
                ?.last()
                ?.toIntOrNull() ?: 1
        }

        val currentPage = pagination.select("li.active a").text().toIntOrNull() ?: 1

        return PageInfo(
            totalPage = lastPage,
            currentPage = currentPage,
            hasNextPage = currentPage < lastPage,
            hasPreviousPage = currentPage > 1
        )
    }

    private suspend fun extractAnimes(document: Document): List<ScrapedAnimeDto> {
        return document.select("div.flw-item").map { element ->
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

            ScrapedAnimeDto(
                id = id ?: hianimeId,
                hianimeId = hianimeId,
                name = name,
                jname = jname,
                episodes = episodes,
                poster = poster
            )
        }
    }

    override suspend fun searchAnime(query: String, page: Int): Pagination<ScrapedAnimeDto> {
        val document = httpClient.getDocument("$baseUrl/search") {
            parameter("keyword", query)
            parameter("page", page)
        }

        return Pagination(
            pageInfo = extractPageInfo(document),
            items = extractAnimes(document)
        )
    }

    override suspend fun getAZList(page: Int): Pagination<ScrapedAnimeDto> {
        val document = httpClient.getDocument("$baseUrl/az-list") {
            parameter("page", page)
        }

        return Pagination(
            pageInfo = extractPageInfo(document),
            items = extractAnimes(document)
        )
    }

    override suspend fun getSyncData(id: String): SyncData {
        val document = httpClient.getDocument("$baseUrl/$id")

        val json = document.getElementById("syncData")
            ?.data()
            .toStringOrNull()

        json ?: return SyncData(id)

        return SyncData.fromJson(json)
    }
}
