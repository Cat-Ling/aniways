import { Jikan4 } from 'node-myanimelist';
import { sanitizeName } from '../../utils/sanitize-name';

export default async function searchAnimeFromJikan(
  query: string,
  page: number
) {
  const animes = await Jikan4.animeSearch({
    q: query,
    limit: 20,
    page: page,
    order_by: 'favorites',
    sort: 'desc',
  });

  const getUrl = (anime: {
    title?: string | undefined;
    title_english?: string | undefined;
    title_japanese?: string | undefined;
  }) => {
    const title =
      anime.title ?? anime.title_english ?? anime.title_japanese ?? 'unknown';

    return `/anime/${sanitizeName(title)}`;
  };

  return {
    animes: animes.data.map(anime => ({
      name:
        anime.title ?? anime.title_english ?? anime.title_japanese ?? 'Unknown',
      url: getUrl(anime),
      image:
        anime.images.jpg.image_url ??
        anime.images.jpg.large_image_url ??
        anime.images.jpg.small_image_url ??
        '',
      total: anime.episodes ?? 0,
    })),
    hasNext: animes.pagination.has_next_page ?? false,
  };
}
