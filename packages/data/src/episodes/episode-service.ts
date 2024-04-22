import {
  getEpisodesByAnimeId,
  getEpisodeUrl,
  seedMissingAnimeEpisodes,
} from './functions';

export namespace EpisodeService {
  export type GetEpisodeUrl = typeof getEpisodeUrl;
  export type GetEpisodesByAnimeId = typeof getEpisodesByAnimeId;
  export type SeedMissingEpisodes = typeof seedMissingAnimeEpisodes;
}

class EpisodeService {
  getEpisodeUrl = getEpisodeUrl;
  getEpisodesByAnimeId = getEpisodesByAnimeId;
  seedMissingEpisodes = seedMissingAnimeEpisodes;
}

export const createEpisodeService = () => new EpisodeService();
