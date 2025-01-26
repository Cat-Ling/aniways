import { getCached } from "./cache";
import {
  getAZList,
  getEpisodes,
  getEpisodeSrc,
  getGenreAnimes,
  getRandomAnime,
  getRecentlyReleasedAnime,
  getSyncData,
  getTopAnime,
  getTrendingAnime,
  searchAnime,
  SearchFilterItems,
  type SearchFilters,
  SearchFilterSchema,
} from "./scrapers";

export { SearchFilterItems, SearchFilterSchema };
export type { SearchFilters };

export class HiAnimeScraper {
  getRandomAnime() {
    return getRandomAnime();
  }

  getSyncData(animeId: string) {
    return getCached(`sync-${animeId}`, () => {
      return getSyncData(animeId);
    });
  }

  search(query: string, page: number, filters?: SearchFilters) {
    return getCached(
      `search-${query}-${page}-${filters ? JSON.stringify(filters) : ""}`,
      () => {
        return searchAnime(query, page, filters);
      },
    );
  }

  getRecentlyReleased(page: number) {
    return getCached(
      `recent-${page}`,
      () => {
        return getRecentlyReleasedAnime(page);
      },
      1000 * 60 * 60 * 1, // 1 hour
    );
  }

  getTrendingAnime() {
    return getCached("trending", getTrendingAnime);
  }

  getTopAnime() {
    return getCached("top", getTopAnime);
  }

  getGenreAnime(genre: string, page: number) {
    return getCached(`genre-${genre}-${page}`, () => {
      return getGenreAnimes(genre, page);
    });
  }

  getEpisodes(animeId: string) {
    return getCached(
      `episodes-${animeId}`,
      () => {
        return getEpisodes(animeId);
      },
      1000 * 60 * 60 * 1,
    ); // 1 hour
  }

  async getEpisodeSources(animeId: string, episode: number) {
    const [syncData, sources] = await Promise.all([
      this.getSyncData(animeId),
      getCached(`episode-${animeId}-${episode}`, () => {
        return getEpisodeSrc(animeId, episode);
      }),
    ]);

    return {
      ...sources,
      ...syncData,
    };
  }

  async getAZList(page = 1) {
    return getAZList(page);
  }
}
