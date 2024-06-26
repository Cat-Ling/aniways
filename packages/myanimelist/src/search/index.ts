import { Jikan4 } from "node-myanimelist";

export type SearchResults = Jikan4.Types.AnimeSearch & {};

export default async function searchAnimeFromMyAnimeList(
  query: string,
  page: number,
  limit = 20
) {
  return Jikan4.animeSearch({
    q: query,
    page,
    limit,
    sfw: true,
  });
}
