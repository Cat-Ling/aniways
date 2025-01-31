package xyz.aniways.features.anime.scrapers

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import org.jsoup.Jsoup
import xyz.aniways.features.anime.dao.AnimeDao
import xyz.aniways.features.anime.dtos.TrendingAnimeDto


class HianimeScraper(
    private val httpClient: HttpClient,
    private val dao: AnimeDao,
) : AnimeScraper {
    private val baseUrl = "https://hianime.to"

    override suspend fun getTrendingAnimes(): List<TrendingAnimeDto> {
        val response = httpClient.get("$baseUrl/home")
        val body = response.bodyAsText()
        val document = Jsoup.parse(body)

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

            val id = dao.getAnimeByHiAnimeId(hiAnimeId)?.id.toString()

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
}
