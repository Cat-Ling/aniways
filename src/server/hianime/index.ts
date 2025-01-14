import { HiAnime } from "aniwatch";
import { cache } from "react";
import { type SearchFilters } from "./search";
import { load } from "cheerio";

export class HiAnimeScraper {
  static BASE_URL = "https://hianime.to";
  private scraper: HiAnime.Scraper;

  constructor() {
    this.scraper = new HiAnime.Scraper();
  }

  // DONE
  async getRandomAnime() {
    const random = await fetch(`${HiAnimeScraper.BASE_URL}/random`, {
      redirect: "manual",
    }).then(async (res) => res.headers.get("Location"));

    const id = random?.split("/").pop();

    return id ?? null;
  }

  //DONE
  async search(query: string, page = 1, searchFilters?: SearchFilters) {
    const searchParams = new URLSearchParams({
      keyword: query,
      page: page.toString(),
    });

    if (searchFilters) {
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (!value) return;
        if (typeof value === "string") {
          searchParams.set(key, value);
          return;
        }
        searchParams.set(key, value.join(","));
      });
    }

    const search = searchParams.toString();

    const $ = await fetch(
      `${HiAnimeScraper.BASE_URL}/search${search ? `?${search}` : ""}`,
    )
      .then((res) => res.text())
      .then(load);

    const animes = $(
      "#main-content > section > div.tab-content > div > div.film_list-wrap > div.flw-item",
    ).map((_, el) => {
      const $el = $(el);

      const id = $el
        .find(".film-poster a")
        .attr("href")!
        .replace("/watch/", "");
      const name = $el.find(".film-detail .film-name a").text();
      const jname =
        $el.find(".film-detail .film-name a").attr("data-jname") ?? null;
      const sub = $el.find(".film-poster .tick.ltr .tick-sub").text();
      const poster = $el.find(".film-poster img").attr("data-src") ?? null;

      return { id, name, jname, episodes: { sub }, poster };
    });

    return {
      animes: animes.get(),
      hasNextPage: $('.pagination a[title="Next"]').length > 0,
      currentPage: page,
    };
  }

  // DONE
  async getInfo(id: string) {
    return this.scraper.getInfo(id);
  }

  // DONE
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

  private getHomePage = cache(() => {
    console.log("Fetching home page");
    return this.scraper.getHomePage();
  });

  // DONE
  async getRecentlyReleased(page = 1) {
    return this.scraper.getCategoryAnime("recently-updated", page);
  }

  // DONE
  async getTrendingAnime() {
    return this.getHomePage().then((page) => page.trendingAnimes);
  }

  // DONE
  async getTopAnime() {
    return this.getHomePage().then((page) => page.top10Animes);
  }

  // DONE
  async getGenres() {
    return this.getHomePage().then((page) => page.genres);
  }

  // DONE
  async getGenreAnime(genre: string, page = 1) {
    return this.scraper.getGenreAnime(genre, page);
  }
}
