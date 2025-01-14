import { scrapeHtml } from "@/lib/utils";
import { hiAnimeUrls, selectors } from "../constants";

export const getTopAnime = async () => {
  const $ = await scrapeHtml({
    url: hiAnimeUrls.home,
  });

  const extractTopAnime = (period: "day" | "week" | "month") => {
    return $(selectors.topAnimeItem(period))
      .map((_, el) => {
        return {
          id:
            $(el)
              .find(".film-detail .dynamic-name")
              ?.attr("href")
              ?.slice(1)
              .trim() ?? null,
          rank: Number($(el).find(".film-number span")?.text()?.trim()) || null,
          name: $(el).find(".film-detail .dynamic-name")?.text()?.trim(),
          jname:
            $(el)
              .find(".film-detail .dynamic-name")
              ?.attr("data-jname")
              ?.trim() ?? null,
          poster:
            $(el)
              .find(".film-poster .film-poster-img")
              ?.attr("data-src")
              ?.trim() ?? null,
          episodes: {
            sub:
              Number(
                $(el)
                  .find(".film-detail .fd-infor .tick-item.tick-sub")
                  ?.text()
                  ?.trim(),
              ) || null,
          },
        };
      })
      .get();
  };

  return {
    today: extractTopAnime("day"),
    week: extractTopAnime("week"),
    month: extractTopAnime("month"),
  };
};
