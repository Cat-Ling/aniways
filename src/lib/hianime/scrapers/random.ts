import { hiAnimeUrls, selectors, SyncDataSchema } from "../constants";
import { scrapeHtml } from "@/lib/utils";

export const getRandomAnime = async () => {
  const $ = await scrapeHtml({
    url: hiAnimeUrls.random,
  });

  const rawSyncData = $(selectors.syncData).text();
  const syncData = SyncDataSchema.parse(JSON.parse(rawSyncData));

  const id = syncData.series_url.split("/").pop();

  return id ?? null;
};
