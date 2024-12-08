import { HiAnime } from "aniwatch";

export const getInfo = async (id: string) => {
  const scraper = new HiAnime.Scraper();

  return scraper.getInfo(id);
};
