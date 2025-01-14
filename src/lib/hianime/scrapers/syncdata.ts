import { scrapeHtml } from "@/lib/utils";
import { hiAnimeUrls, selectors, SyncDataSchema } from "../constants";

export const getSyncData = async (id: string) => {
  const $ = await scrapeHtml({
    url: hiAnimeUrls.animeInfo(id),
  });

  const rawSyncData = $(selectors.syncData).text();
  const syncData = SyncDataSchema.parse(JSON.parse(rawSyncData));

  return {
    hiAnimeId: id,
    seriesUrl: syncData.series_url,
    malId: syncData.mal_id,
    anilistId: syncData.anilist_id,
  };
};
