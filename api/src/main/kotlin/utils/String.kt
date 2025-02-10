package xyz.aniways.utils

fun String.trimToNull(): String? {
    return if (this.isBlank()) null else this.trim()
}

fun<T> T.toStringOrNull(): String? {
    val s = this.toString()
    if (s == "null") return null
    return s.ifBlank { null }
}
fun String.formatGenre(): String {
    return split("-")
        .joinToString(" ") {
            when (it) {
                "sci" -> "Sci-Fi"
                "fi" -> ""
                "of" -> it
                else -> it.replaceFirstChar { it.titlecase() }
            }
        }
        .trim()
}