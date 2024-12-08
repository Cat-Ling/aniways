import { HiAnime } from "aniwatch";

export const getEpisodes = async (id: string) => {
  const scraper = new HiAnime.Scraper();

  return scraper.getEpisodes(id);
};
