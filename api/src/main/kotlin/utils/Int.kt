package xyz.aniways.utils

fun Int.nullIfZero(): Int? {
    return if (this == 0) null else this
}