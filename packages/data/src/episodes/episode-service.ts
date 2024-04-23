import {
  getEpisodesByAnimeId,
  getEpisodeUrl,
  seedMissingAnimeEpisodes,
} from './functions';

export namespace EpisodeServiceTypes {
  export type GetEpisodeUrl = typeof getEpisodeUrl;
  export type GetEpisodesByAnimeId = typeof getEpisodesByAnimeId;
  export type SeedMissingEpisodes = typeof seedMissingAnimeEpisodes;
}

export class EpisodeService {
  static NOT_FOUND = 'not-found' as const;

  getEpisodeUrl = getEpisodeUrl;
  getEpisodesByAnimeId = getEpisodesByAnimeId;
  seedMissingEpisodes = seedMissingAnimeEpisodes;
}

export const createEpisodeService = () => new EpisodeService();
