import { Jikan4 } from 'node-myanimelist';

export default async function searchAnimeFromMyAnimeList(
  query: string,
  page: number,
  limit: number = 20
) {
  return Jikan4.animeSearch({
    q: query,
    page,
    limit,
    sfw: true,
  });
}
