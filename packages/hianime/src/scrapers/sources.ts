import { HiAnime } from "aniwatch";

export const getEpisodeSources = async (
  episodeId: string,
  server: HiAnime.AnimeServers
) => {
  const scraper = new HiAnime.Scraper();

  return scraper.getEpisodeSources(episodeId, server);
};
