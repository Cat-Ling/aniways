import { scrapeHtml } from "@/lib/utils";
import { hiAnimeUrls, selectors } from "../constants";

export const getTrendingAnime = async () => {
  const $ = await scrapeHtml({
    url: hiAnimeUrls.base,
  });

  return $(selectors.trending)
    .map((_, el) => {
      return {
        rank: parseInt(
          $(el).find(".item .number")?.children()?.first()?.text()?.trim(),
        ),
        id:
          $(el).find(".item .film-poster")?.attr("href")?.slice(1)?.trim() ??
          null,
        name: $(el)
          .find(".item .number .film-title.dynamic-name")
          ?.text()
          ?.trim(),
        jname:
          $(el)
            .find(".item .number .film-title.dynamic-name")
            ?.attr("data-jname")
            ?.trim() ?? null,
        poster:
          $(el)
            .find(".item .film-poster .film-poster-img")
            ?.attr("data-src")
            ?.trim() ?? null,
      };
    })
    .get();
};
