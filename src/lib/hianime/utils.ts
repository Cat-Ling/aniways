import { type CheerioAPI } from "cheerio";
import { selectors } from "./constants";

export const extractAnimes = ($: CheerioAPI) => {
  const animes = $(selectors.animeCards)
    .map((_, el) => {
      const $el = $(el);

      return {
        id: $el.find(".film-poster a").attr("href")!.replace("/watch/", ""),
        name: $el.find(".film-detail .film-name a").text(),
        jname: $el.find(".film-detail .film-name a").attr("data-jname") ?? null,
        episodes: $el.find(".film-poster .tick.ltr .tick-sub").text(),
        poster: $el.find(".film-poster img").attr("data-src") ?? null,
      };
    })
    .get();

  const hasNextPage = $(selectors.nextPage).length > 0;

  return { animes, hasNextPage };
};
