import { scrapeHtml } from "@/lib/utils";
import { hiAnimeUrls, selectors } from "../constants";
import { extractAnimes } from "../utils";

export const getGenreAnimes = (genre: string, page: number) => {
  genre = genre === "martial-arts" ? "marial-arts" : genre;

  return scrapeHtml({
    url: `${hiAnimeUrls.genre(genre)}?page=${page}`,
    extract: ($) => {
      const animes = extractAnimes($);
      const genreName = $(selectors.genreName).text().trim() ?? genre;

      return {
        ...animes,
        genreName,
      };
    },
  });
};
