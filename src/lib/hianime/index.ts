import {
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
    return getSyncData(animeId);
  }

  search(query: string, page: number, filters?: SearchFilters) {
    return searchAnime(query, page, filters);
  }

  getRecentlyReleased(page: number) {
    return getRecentlyReleasedAnime(page);
  }

  getTrendingAnime() {
    return getTrendingAnime();
  }

  getTopAnime() {
    return getTopAnime();
  }

  getGenreAnime(genre: string, page: number) {
    return getGenreAnimes(genre, page);
  }

  getEpisodes(animeId: string) {
    return getEpisodes(animeId);
  }

  async getEpisodeSources(animeId: string, episode: number) {
    const [syncData, sources] = await Promise.all([
      this.getSyncData(animeId),
      getEpisodeSrc(animeId, episode),
    ]);

    return {
      ...sources,
      ...syncData,
    };
  }
}
