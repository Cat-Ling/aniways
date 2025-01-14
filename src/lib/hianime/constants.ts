import { z } from "zod";

const BASE_URL = "https://hianime.to";

export const hiAnimeUrls = {
  base: BASE_URL,
  random: `${BASE_URL}/random`,
  search: `${BASE_URL}/search`,
  recentlyReleased: `${BASE_URL}/recently-updated`,
  animeInfo: (id: string) => {
    return `${BASE_URL}/${id}`;
  },
  watch: (id: string) => {
    return `${BASE_URL}/watch/${id}`;
  },
  genre: (genre: string) => {
    return `${BASE_URL}/genre/${genre}`;
  },
  episodesListAjax: (id: string) => {
    return `${BASE_URL}/ajax/v2/episode/list/${id.split("-").pop()}`;
  },
  episodeServerAjax: `${BASE_URL}/ajax/v2/episode/servers`,
  episodeSourcesAjax: `${BASE_URL}/ajax/v2/episode/sources`,
};

export const selectors = {
  syncData: "#syncData",
  episodeBtn: ".detail-infor-content .ss-list a",
  filler: "ssl-item-filler",
  animeCards: "#main-content div.film_list-wrap > div.flw-item",
  nextPage: '.pagination a[title="Next"]',
  genreName: "#main-content .block_area .block_area-header .cat-heading",
  trending: "#trending-home .swiper-wrapper .swiper-slide",
  mostViewed: '#main-sidebar .block_area-realtime [id^="top-viewed-"]',
  topAnimeItem: (period: "day" | "week" | "month") =>
    `#top-viewed-${period} ul li`,
  servers: {
    sub: ".ps_-block.ps_-block-sub.servers-sub .ps__-list .server-item",
    raw: ".ps_-block.ps_-block-sub.servers-raw .ps__-list .server-item",
  },
};

export const attrs = {
  title: "title",
  episodeId: "href",
  number: "data-number",
};

export const SyncDataSchema = z.object({
  series_url: z.string(),
  mal_id: z.coerce.number(),
  anilist_id: z.coerce.number(),
});

export const AjaxSchema = z.object({
  html: z.string(),
});

export const EpisodeSourceSchema = z.object({
  link: z.string().url(),
  server: z.number(),
});
