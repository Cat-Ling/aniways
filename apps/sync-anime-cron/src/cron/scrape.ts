import type { RecentlyReleasedAnime } from "@aniways/gogoanime";
import { db, orm, schema } from "@aniways/db";
import { scrapeRecentlyReleasedAnimeEpisodes } from "@aniways/gogoanime";

import { createLogger } from "../utils/logger";

const logger = createLogger("AniwaysSyncAnimeCron", "scrape");

const scrapeRecentlyReleasedAnimes = async () => {
  const recentlyReleasedAnimes = await Promise.all([
    scrapeRecentlyReleasedAnimeEpisodes(1).then(data => data.anime),
    scrapeRecentlyReleasedAnimeEpisodes(2).then(data => data.anime),
  ]);

  return recentlyReleasedAnimes.flat().reverse();
};

const filterScrapedAnimes = async (
  recentlyReleasedAnimes: RecentlyReleasedAnime[]
) => {
  const lastUpdatedAnimes = await db
    .select({
      id: schema.anime.id,
      slug: schema.anime.slug,
      lastEpisode: schema.anime.lastEpisode,
    })
    .from(schema.anime)
    .where(
      orm.inArray(
        schema.anime.slug,
        recentlyReleasedAnimes.map(a => a.animeSlug)
      )
    );

  return recentlyReleasedAnimes.filter(a => {
    const animeFromDB = lastUpdatedAnimes.find(
      anime => anime.slug === a.animeSlug
    );

    const isNewEpisode =
      !animeFromDB || animeFromDB.lastEpisode !== String(a.episode);

    if (isNewEpisode) {
      logger.log("New episode found", a.name, a.episode);
    }

    return isNewEpisode;
  });
};

export const scrape = async () => {
  logger.log("Start scraping of recently released anime episodes");

  const recentlyReleasedAnime = await scrapeRecentlyReleasedAnimes();

  const newAnimes = await filterScrapedAnimes(recentlyReleasedAnime);

  logger.log("Scraped", newAnimes.length, "new anime episodes");

  return newAnimes;
};
