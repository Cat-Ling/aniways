import { db } from "@aniways/db";
import { scrapeRecentlyReleasedAnime } from "@aniways/web-scraping";

import { createLogger } from "../utils/logger";

const logger = createLogger("AniwaysSyncAnimeCron", "scrape");

export type RecentlyReleasedAnime = Awaited<
  ReturnType<typeof scrapeRecentlyReleasedAnime>
>["anime"][number] & {
  slug: string;
};

const scrapeRecentlyReleasedAnimes = async () => {
  const recentlyReleasedAnimes = await Promise.all([
    scrapeRecentlyReleasedAnime(1).then((data) => data.anime),
    scrapeRecentlyReleasedAnime(2).then((data) => data.anime),
  ]);

  return recentlyReleasedAnimes
    .flat()
    .reverse()
    .map((a) => ({
      ...a,
      slug: a.url.replace("/anime/", "").split("/")[0],
    }))
    .filter((a) => !!a.slug) as RecentlyReleasedAnime[];
};

const filterScrapedAnimes = async (
  recentlyReleasedAnimes: RecentlyReleasedAnime[],
) => {
  const lastUpdatedAnimes = await db.query.anime.findMany({
    columns: {
      id: true,
      slug: true,
      lastEpisode: true,
    },
    orderBy: ({ updatedAt }, { desc }) => desc(updatedAt),
    limit: 60,
    with: {
      videos: {
        columns: {
          slug: true,
        },
        limit: 1,
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
      },
    },
  });

  return recentlyReleasedAnimes.filter((a) => {
    const animeFromDB = lastUpdatedAnimes.find(
      (anime) =>
        anime.slug === a.slug ||
        anime.videos[0]?.slug.split("-episode-")[0] === a.slug,
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
