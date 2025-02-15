package xyz.aniways.features.anime.api.anilist

object Queries {
    private const val MEDIA_FIELDS = """
        id
        idMal
        title {
            romaji
        }
        bannerImage
        coverImage {
            large
            extraLarge
        }
        description
        format
        episodes
        startDate {
            year
            month
            day
        }
    """

    const val SEASONAL_ANIME = """
        query (${'$'}year: Int, ${'$'}season: MediaSeason) {
            page: Page(page: 1, perPage: 10) {
                media(
                    season: ${'$'}season, 
                    seasonYear: ${'$'}year, 
                    sort: POPULARITY_DESC,
                    type: ANIME, 
                    isAdult: false
                ) {
                    $MEDIA_FIELDS
                }
            }
        }        
    """

    const val TRENDING_ANIME = """
        query {
            page: Page(page: 1, perPage: 10) {
                media(
                    sort: TRENDING_DESC,
                    type: ANIME, 
                    isAdult: false,
                    startDate_greater: 19800101
                ) {
                    $MEDIA_FIELDS
                }
            }
        }
    """

    const val POPULAR_ANIME = """
        query {
            page: Page(page: 1, perPage: 10) {
                media(
                    sort: POPULARITY_DESC,
                    type: ANIME, 
                    isAdult: false
                ) {
                    $MEDIA_FIELDS
                }
            }
        }
    """

    const val ANIME_DETAILS = """
        query (${'$'}idMal: Int) {
            media: Media(idMal: ${'$'}idMal) {
                $MEDIA_FIELDS
            }
        }
    """
}