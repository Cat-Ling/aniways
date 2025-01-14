import { scrapeHtml } from "@/lib/utils";
import { getEpisodes } from "./episodes";
import {
  AjaxSchema,
  EpisodeSourceSchema,
  hiAnimeUrls,
  selectors,
} from "../constants";

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
          serverIndex: Number($(el)?.attr("data-server-id")?.trim()) || null,
          serverId: $(el)?.attr("data-id")?.trim() ?? null,
        }));
      };

      return {
        sub: extractServer("sub").get(),
        raw: extractServer("raw").get(),
      };
    },
  });

  const order = [...sources.sub, ...sources.raw].filter(
    (src) => src.serverIndex === 1 || src.serverIndex === 4, // filter out all servers except VidStreaming and VidCloud
  );

  const firstSource = order[0];
  if (!firstSource?.serverId) throw new Error("No source found");

  let videoSource = await extractEpisodeVideoUrl(firstSource.serverId).catch(
    () => null,
  );

  while (!videoSource && order.length > 0) {
    const nextSource = order.shift();
    if (!nextSource?.serverId) continue;
    videoSource = await extractEpisodeVideoUrl(nextSource.serverId).catch(
      () => null,
    );
  }

  if (!videoSource) throw new Error("No source found");

  return {
    ...videoSource,
    nextEpisode,
  };
};

const extractEpisodeVideoUrl = async (serverId: string) => {
  const episodeSource = await fetch(
    `${hiAnimeUrls.episodeSourcesAjax}?id=${serverId}`,
  )
    .then((res) => res.json())
    .then((data) => EpisodeSourceSchema.parse(data));

  const getSources = await import("./megacloud").then((mod) => mod.getSources);

  const source = await getSources(
    new URL(episodeSource.link).pathname.split("/").pop()!,
  );

  if (!source)
    return {
      tracks: [],
      intro: {
        start: 0,
        end: 0,
      },
      outro: {
        start: 0,
        end: 0,
      },
      sources: [],
    };

  return {
    sources: Array.isArray(source.sources)
      ? source.sources.map((src) => ({
          url: src.file,
          type: src.type,
        }))
      : [],
    intro: {
      start: source.intro?.start ?? 0,
      end: source.intro?.end ?? 0,
    },
    outro: {
      start: source.outro?.start ?? 0,
      end: source.outro?.end ?? 0,
    },
    tracks: source.tracks,
  };
};
