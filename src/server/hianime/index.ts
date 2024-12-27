import { HiAnime } from "aniwatch";
import { load } from "cheerio";
import { z } from "zod";

const SYNC_URL = `https://raw.githubusercontent.com/bal-mackup/mal-backup/refs/heads/master/mal/anime`;
const BASE_URL = "https://hianime.to";

const SyncDataSchema = z.object({
  id: z.number(),
  Sites: z.object({
    Zoro: z.record(
      z.object({
        identifier: z.string(),
        url: z.string().url(),
      }),
    ),
  }),
});

export class HiAnimeScraper {
  private scraper: HiAnime.Scraper;

  constructor() {
    this.scraper = new HiAnime.Scraper();
  }

  async getHiAnimeIdFromMalId(malId: number) {
    const response = await fetch(`${SYNC_URL}/${malId}.json`)
      .then((res) => res.json())
      .then((data) => SyncDataSchema.parse(data))
      .catch(() => null);

    const url = Object.values(response?.Sites.Zoro ?? {})[0]?.url;

    const id = url?.split("/").pop();

    return id ?? null;
  }

  async getMalIdFromHiAnimeId(hiAnimeId: string) {
    return this.scraper
      .getInfo(hiAnimeId)
      .then((data) => data.anime.info.malId)
      .then((malId) => {
        if (!malId) throw new Error();
        return malId;
      })
      .catch(() => {
        throw new Error("No MAL ID found");
      });
  }

  async getRandomAnime() {
    const random = await fetch(`${BASE_URL}/random`, {
      redirect: "manual",
    }).then(async (res) => res.headers.get("Location"));

    const id = random?.split("/").pop();

    return id ?? null;
  }

  async search(query: string, page = 1) {
    return this.scraper.search(query, page);
  }

  async getInfo(id: string) {
    return this.scraper.getInfo(id);
  }

  async getEpisodes(id: string) {
    return this.scraper.getEpisodes(id);
  }

  private async getSourceFromServer(server: HiAnime.ScrapedEpisodeServers) {
    let isError = false;
    let currentIndex = 0;

    let sources = await this.scraper
      .getEpisodeSources(server.episodeId)
      .catch(() => {
        isError = true;
        return undefined;
      });

    if (!isError) return sources;

    while (isError && currentIndex <= server.raw.length) {
      const raw = server.raw[currentIndex];

      if (!raw?.serverName) {
        isError = true;
        currentIndex++;
        continue;
      }

      try {
        sources = await this.scraper.getEpisodeSources(
          server.episodeId,
          raw?.serverName as HiAnime.AnimeServers,
          "raw",
        );
        isError = false;
      } catch {
        isError = true;
        currentIndex++;
      }
    }

    return sources;
  }

  async getEpisodeSrc(id: string, episode: number) {
    const { episodes } = await this.scraper.getEpisodes(id);

    const episodeId = episodes.find((ep) => ep.number === episode)?.episodeId;
    const currentEpisodeIndex = episodes.findIndex(
      (ep) => ep.number === episode,
    );
    const nextEpisode = episodes[currentEpisodeIndex + 1]?.number ?? null;

    if (!episodeId) throw new Error("Episode not found");

    const servers = await this.scraper.getEpisodeServers(episodeId);
    console.log({ servers: servers.raw });

    const sources = (await this.getSourceFromServer(servers)) as
      | (HiAnime.ScrapedAnimeEpisodesSources & {
          anilistID: number | null;
          malID: number | null;
          tracks: {
            file: string;
            label: string;
            kind: "captions" | "thumbnails";
            default?: true;
          }[];
        })
      | undefined;

    if (!sources) throw new Error("No sources found");

    return {
      ...sources,
      nextEpisode,
    };
  }

  async getRecentlyReleased(page = 1) {
    const $ = await fetch(`${BASE_URL}/recently-updated?page=${page}`)
      .then((res) => res.text())
      .then(load);

    const animes = $(".film_list-wrap .flw-item").map((i, el) => {
      const $el = $(el);

      const id = $el
        .find(".film-detail .film-name a")
        .attr("href")!
        .split("/")
        .pop()!;
      const title =
        $el.find(".film-detail .film-name a").attr("data-jname") ??
        $el.find(".film-detail .film-name a").text() ??
        "";
      const image = $el.find("img.film-poster-img").attr("data-src") ?? "";
      const episode = $el.find(".tick-item.tick-sub").text() ?? "";

      const description = $el.find(".description").text() ?? null;

      return {
        id,
        title,
        image,
        episode: Number(episode),
        description,
      };
    });

    return {
      animes: animes.get(),
      hasNextPage: !!$('.pre-pagination a[title="Next"]').length,
    };
  }

  async getTrendingAnime() {
    return this.scraper.getHomePage().then((page) => page.trendingAnimes);
  }
}
