package xyz.aniways.features.anime.scrapers

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.network.selector.*
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.dtos.TopAnimeDto
import xyz.aniways.features.anime.dtos.TopAnimeNodeDto
import xyz.aniways.features.anime.dtos.TrendingAnimeDto
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
}
