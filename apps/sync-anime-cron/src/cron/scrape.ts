import { db, orm, schema } from "@aniways/db";
import { scrapeRecentlyReleasedAnime } from "@aniways/web-scraping";

import { createLogger } from "../utils/logger";

const logger = createLogger("AniwaysSyncAnimeCron", "scrape");

export type RecentlyReleasedAnime = Awaited<
  ReturnType<typeof scrapeRecentlyReleasedAnime>
>["anime"][number];

const scrapeRecentlyReleasedAnimes = async () => {
  const recentlyReleasedAnimes = await Promise.all([
    scrapeRecentlyReleasedAnime(1).then(data => data.anime),
    scrapeRecentlyReleasedAnime(2).then(data => data.anime),
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
    .orderBy(orm.desc(schema.anime.updatedAt))
    .limit(60);

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
