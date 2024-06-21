import {
  getEpisodesByAnimeId,
  getEpisodeUrl,
  seedMissingAnimeEpisodes,
} from "./functions";

export class EpisodeService {
  static NOT_FOUND = "not-found" as const;

  getEpisodeUrl = getEpisodeUrl;
  getEpisodesByAnimeId = getEpisodesByAnimeId;
  seedMissingEpisodes = seedMissingAnimeEpisodes;
}

export const createEpisodeService = () => new EpisodeService();
