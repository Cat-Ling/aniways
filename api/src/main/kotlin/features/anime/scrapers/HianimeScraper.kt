package xyz.aniways.features.anime.scrapers

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import kotlinx.coroutines.coroutineScope
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import xyz.aniways.features.anime.dtos.*
import xyz.aniways.models.PageInfo
import xyz.aniways.models.Pagination
import xyz.aniways.utils.getDocument
import xyz.aniways.utils.toStringOrNull

class HianimeScraper(
    private val httpClient: HttpClient,
) : AnimeScraper() {
    private val baseUrl = "https://hianimez.to"

    override suspend fun getTrendingAnimes(): List<ScrapedAnimeDto> {
        val document = httpClient.getDocument("$baseUrl/home") {
            header("Referer", baseUrl)
            header("User-Agent", getRandomUserAgent())
        }

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

            ScrapedAnimeDto(
                hianimeId = hianimeId,
                name = name,
                jname = jname,
                poster = poster,
                episodes = null,
            )
        }
    }

    private fun getTopAnimeNodes(
        document: Document,
        type: String
    ): List<ScrapedAnimeDto> {
        return document.select("#top-viewed-$type ul li").map { element ->
            val link = element.select(".film-detail .dynamic-name")

            val hianimeId = link.attr("href").removePrefix("/").trim()
            val name = link.text().trim()
            val jname = link.attr("data-jname").trim()

            val poster = element.select(".film-poster .film-poster-img")
                .attr("data-src")
                .trim()

            val episodes = element.select(".film-detail .fd-infor .tick-item.tick-sub").text()

            ScrapedAnimeDto(
                hianimeId = hianimeId,
                name = name,
                jname = jname,
                poster = poster,
                episodes = episodes
            )
        }
    }

    override suspend fun getTopAnimes(): ScrapedTopAnimeDto {
        val document = httpClient.getDocument("$baseUrl/home") {
            header("Referer", baseUrl)
            header("User-Agent", getRandomUserAgent())
        }

        return ScrapedTopAnimeDto(
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

    private fun extractAnimes(document: Document): List<ScrapedAnimeDto> {
        return document.select("div.flw-item").map { element ->
            val hianimeId = element.select(".film-poster a")
                .attr("href")
                .split("/")
                .last()
                .trim()

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

            header("Referer", "$baseUrl/search")
            header("User-Agent", getRandomUserAgent())
        }

        return Pagination(
            pageInfo = extractPageInfo(document),
            items = extractAnimes(document)
        )
    }

    override suspend fun getAZList(page: Int): Pagination<ScrapedAnimeDto> {
        val document = httpClient.getDocument("$baseUrl/az-list") {
            parameter("page", page)

            header("Referer", "$baseUrl/az-list")
            header("User-Agent", getRandomUserAgent())
        }

        return Pagination(
            pageInfo = extractPageInfo(document),
            items = extractAnimes(document)
        )
    }

    private fun extractSyncData(document: Document, id: String): SyncData {
        val json = document.getElementById("syncData")
            ?.data()
            .toStringOrNull()

        json ?: return SyncData(id)

        return SyncData.fromJson(json)
    }

    override suspend fun getAnimeInfo(id: String): ScrapedAnimeInfoDto {
        val document = httpClient.getDocument("$baseUrl/$id") {
            header("Referer", baseUrl)
            header("User-Agent", getRandomUserAgent())
        }

        val syncData = extractSyncData(document, id)

        val titleElement = document.select("h2.film-name.dynamic-name")
        val name = titleElement.text().trim()
        val jname = titleElement.attr("data-jname").trim()
        val poster = document.select(".film-poster img")
            .attr("src")
            .trim()

        val genre = document.select(".anisc-info .item-list a")
            .filter { a -> a.attr("href").contains("genre") }
            .joinToString { it.text() }
            .toStringOrNull()
            ?: "unknown"

        val lastEpisodeReleased = document.select(".tick-item.tick-sub")
            .first()
            ?.text()
            ?.toIntOrNull()

        return ScrapedAnimeInfoDto(
            id = id,
            name = name,
            jname = jname,
            poster = poster,
            genre = genre,
            malId = syncData.malId,
            anilistId = syncData.anilistId,
            lastEpisode = lastEpisodeReleased
        )
    }

    override suspend fun getRecentlyUpdatedAnime(page: Int): Pagination<ScrapedAnimeDto> {
        val document = httpClient.getDocument("$baseUrl/recently-updated") {
            parameter("page", page)

            header("Referer", "$baseUrl/home")
            header("User-Agent", getRandomUserAgent())
        }

        return Pagination(
            pageInfo = extractPageInfo(document),
            items = extractAnimes(document)
        )
    }

    override suspend fun getEpisodesOfAnime(hianimeId: String): List<EpisodeDto> {
        val response = httpClient.get("$baseUrl/ajax/v2/episode/list/${hianimeId.split("-").last()}") {
            header("X-Requested-With", "XMLHttpRequest")
            header("Referer", "$baseUrl/watch/$hianimeId")
            header("User-Agent", getRandomUserAgent())
        }

        val data = response.body<RawEpisodeData>()
        val document = data.html?.let { Jsoup.parse(it) } ?: return emptyList()

        return document.select(".detail-infor-content .ss-list a").map { element ->
            EpisodeDto(
                title = element.attr("title").trim(),
                number = element.attr("data-number").toIntOrNull() ?: 1,
                isFiller = element.hasClass("ssl-item-filler"),
                id = element.attr("href").split("?ep=").last().trim()
            )
        }
    }

    @Deprecated("This method is deprecated, get iframe through streaming service instead")
    suspend fun getIframeUrl(episodeId: String, serverId: String): String? {
        val response = httpClient.get("$baseUrl/ajax/v2/episode/sources?id=$serverId") {
            header("X-Requested-With", "XMLHttpRequest")
            header("Referer", "$baseUrl/watch/$episodeId")
            header("User-Agent", getRandomUserAgent())
        }

        return response.body<RawEpisodeSourceData>().link
    }

    override suspend fun getServersOfEpisode(episodeId: String): List<EpisodeServerDto> = coroutineScope {
        val response = httpClient.get("$baseUrl/ajax/v2/episode/servers?episodeId=$episodeId") {
            header("X-Requested-With", "XMLHttpRequest")
            header("Referer", "$baseUrl/watch/$episodeId")
            header("User-Agent", getRandomUserAgent())
        }

        val data = response.body<RawEpisodeData>()
        val document = data.html?.let { Jsoup.parse(it) } ?: return@coroutineScope emptyList()

        document.select(".server-item").map { element ->
            val serverIndex = element.attr("data-server-id")

            if (serverIndex != "1" && serverIndex != "4") {
                return@map null
            }

            val serverId = element.attr("data-id")

            EpisodeServerDto(
                type = element.attr("data-type"),
                serverName = element.text().trim(),
                serverId = serverId,
            )
        }.filterNotNull()
    }
}
