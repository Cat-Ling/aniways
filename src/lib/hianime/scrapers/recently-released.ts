import { scrapeHtml } from "@/lib/utils";
import { hiAnimeUrls } from "../constants";
import { extractAnimes } from "../utils";

export const getRecentlyReleasedAnime = (page: number) => {
  return scrapeHtml({
    url: `${hiAnimeUrls.recentlyReleased}?page=${page}`,
    extract: extractAnimes,
  });
};
