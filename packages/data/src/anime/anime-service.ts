import {
  getAnimeById,
  getContinueWatchingAnime,
  getRecentlyReleasedAnime,
  searchAnimeFromDB,
} from './functions';

export namespace AnimeServiceTypes {
  export type GetAnimeById = typeof getAnimeById;
  export type GetContinueWatchingAnime = typeof getContinueWatchingAnime;
  export type GetRecentlyReleasedAnime = typeof getRecentlyReleasedAnime;
  export type SearchAnime = typeof searchAnimeFromDB;
}

export class AnimeService {
  getAnimeById = getAnimeById;
  getContinueWatchingAnimes = getContinueWatchingAnime;
  getRecentlyReleasedAnimes = getRecentlyReleasedAnime;
  searchAnime = searchAnimeFromDB;
}

export const createAnimeService = () => new AnimeService();
