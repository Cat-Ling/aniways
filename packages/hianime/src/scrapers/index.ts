import { getEpisodes } from "./episodes";
import { getInfo } from "./info";
import { getRecentlyReleasedAnime } from "./recently-released";
import { getServer } from "./server";
import { getEpisodeSources } from "./sources";

export const hiAnimeScraper = {
  getRecentlyReleasedAnime,
  getEpisodes,
  getInfo,
  getServer,
  getEpisodeSources,
};
