import { z } from "zod";

const BASE_URL = "https://hianime.to";

export const hiAnimeUrls = {
  base: BASE_URL,
  random: `${BASE_URL}/random`,
  search: `${BASE_URL}/search`,
};

export const selectors = {
  syncData: "#syncData",
};

export const SyncDataSchema = z.object({
  series_url: z.string(),
  mal_id: z.coerce.number(),
  anilist_id: z.coerce.number(),
});
