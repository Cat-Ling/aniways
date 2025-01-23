import { scrapeHtml } from "@/lib/utils";
import { hiAnimeUrls } from "../constants";

export const getAZList = async (page = 1) => {
  return scrapeHtml({
    url: `${hiAnimeUrls.azList}?page=${page}`,
    extract: ($) => {
      const ids = $(".flw-item .film-poster a")
        .map((_, el) => {
          const $el = $(el);
          const url = $el.attr("href");

          return url?.replace("/watch/", "");
        })
        .get();

      const hasNextPage = !!$(".page-item a[title='Next']").length;

      return {
        animes: ids,
        hasNextPage,
      };
    },
  });
};
