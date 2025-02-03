package xyz.aniways.utils

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import org.jsoup.Jsoup
import org.jsoup.nodes.Document

suspend fun HttpClient.getDocument(
    url: String,
    block: HttpRequestBuilder.() -> Unit = {}
): Document {
    val response = this.get(url, block)
    val body = response.bodyAsText()
    return Jsoup.parse(body)
}