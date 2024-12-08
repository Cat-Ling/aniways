import { HiAnime } from "aniwatch";

export const getServer = async (episodeId: string) => {
  const scraper = new HiAnime.Scraper();

  const result = await scraper.getEpisodeServers(episodeId);

  return {
    ...result,
    sub: result.sub.map(sub => ({
      ...sub,
      serverName: sub.serverName as any as HiAnime.AnimeServers,
    })),
    dub: result.dub.map(dub => ({
      ...dub,
      serverName: dub.serverName as any as HiAnime.AnimeServers,
    })),
    raw: result.raw.map(raw => ({
      ...raw,
      serverName: raw.serverName as any as HiAnime.AnimeServers,
    })),
  };
};
