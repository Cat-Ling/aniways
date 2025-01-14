import { scrapeHtml } from "@/lib/utils";
import { getEpisodes } from "./episodes";
import { AjaxSchema, hiAnimeUrls, selectors } from "../constants";

export const getEpisodeSrc = async (animeId: string, episode: number) => {
  const { episodes } = await getEpisodes(animeId);

  const episodeId = episodes.find((ep) => ep.number === episode)?.episodeId;
  const currentEpisodeIndex = episodes.findIndex((ep) => ep.number === episode);
  const nextEpisode = episodes[currentEpisodeIndex + 1]?.number ?? null;

  if (!episodeId) throw new Error("Episode not found");

  const sources = await scrapeHtml({
    url: `${hiAnimeUrls.episodeServerAjax}?episodeId=${episodeId.split("?ep=")[1]}`,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Referer: hiAnimeUrls.watch(episodeId),
    },
    prepareHtml: (html) => {
      return AjaxSchema.parse(JSON.parse(html)).html;
    },
    extract: ($) => {
      const extractServer = (type: "sub" | "raw") => {
        return $(selectors.servers[type]).map((_, el) => ({
          type,
          serverName: $(el).find("a").text().toLowerCase().trim(),
          serverId: Number($(el)?.attr("data-server-id")?.trim()) || null,
        }));
      };

      return {
        sub: extractServer("sub").get(),
        raw: extractServer("raw").get(),
      };
    },
  });

  const order = [...sources.sub, ...sources.raw];

  const $ = await scrapeHtml({
    url: hiAnimeUrls.watch(episodeId),
  });
};
