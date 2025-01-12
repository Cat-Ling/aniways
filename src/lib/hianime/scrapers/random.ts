import { hiAnimeUrls, selectors, SyncDataSchema } from "../constants";
import { loadHtmlFromUrl } from "@/lib/utils";

export const getRandomAnime = async () => {
  const $ = await loadHtmlFromUrl(hiAnimeUrls.random);

  const rawSyncData = $(selectors.syncData).text();
  const syncData = SyncDataSchema.parse(JSON.parse(rawSyncData));

  return syncData.series_url.split("/").pop() ?? null;
};
