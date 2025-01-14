import { scrapeHtml } from "@/lib/utils";
import { AjaxSchema, attrs, hiAnimeUrls, selectors } from "../constants";

export const getEpisodes = async (id: string) => {
  const $ = await scrapeHtml({
    url: hiAnimeUrls.episodesListAjax(id),
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Referer: hiAnimeUrls.watch(id),
    },
    prepareHtml: (html) => {
      return AjaxSchema.parse(JSON.parse(html)).html;
    },
  });

  const episodes = $(selectors.episodeBtn)
    .map((_, el) => {
      const $el = $(el);

      return {
        title: $el.attr(attrs.title)?.trim() ?? null,
        episodeId: $el.attr(attrs.episodeId)?.split("/")?.pop() ?? null,
        number: Number($(el).attr(attrs.number)),
        isFiller: $(el).hasClass(selectors.filler),
      };
    })
    .get();

  return {
    episodes,
    totalEpisodes: episodes.length,
  };
};
