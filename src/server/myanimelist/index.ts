import { env } from "@/env";
import { type AnimeNode, MALClient, type WatchStatus } from "@animelist/client";
import { Jikan4 } from "node-myanimelist";
import { HiAnimeScraper } from "../hianime";
import { load } from "cheerio";

type GetAnimeListArgs = {
  username: string;
  page: number;
  limit: number;
  status: WatchStatus | undefined;
};

type UpdateMalStatusArgs = {
  malId: number;
  status?: WatchStatus;
  numWatchedEpisodes?: number;
  score?: number | undefined;
};

type DeleteMalStatusArgs = {
  malId: number;
};

export class MalScraper {
  private client: MALClient;
  private isLoggedIn = false;

  constructor(accessToken?: string) {
    this.client = new MALClient(
      accessToken ? { accessToken } : { clientId: env.MAL_CLIENT_ID },
    );
    this.isLoggedIn = !!accessToken;
  }

  async getAnimeList({
    username,
    page = 1,
    limit = 20,
    status = undefined,
  }: GetAnimeListArgs) {
    if (!this.isLoggedIn) {
      throw new Error("Not logged in");
    }

    return await this.client.getUserAnimeList(username, {
      limit,
      offset: (page - 1) * limit,
      fields: [
        "alternative_titles",
        "average_episode_duration",
        "genres",
        "my_list_status",
        "synopsis",
        "num_episodes",
      ],
      status,
      nsfw: true,
      sort: "anime_title",
    });
  }

  async updateEntry({
    malId,
    status = "watching",
    numWatchedEpisodes = 0,
    score,
  }: UpdateMalStatusArgs) {
    if (!this.isLoggedIn) {
      throw new Error("Not logged in");
    }

    return await this.client.updateMyAnimeListStatus(malId, {
      status,
      num_watched_episodes: numWatchedEpisodes,
      score,
    });
  }

  async deleteEntry({ malId }: DeleteMalStatusArgs) {
    if (!this.isLoggedIn) {
      throw new Error("Not logged in");
    }

    return await this.client.deleteMyAnimeListStatus(malId);
  }

  private formatRating(rating: string) {
    switch (rating) {
      case "g":
        return "G - All Ages";
      case "pg":
        return "PG - Children";
      case "pg_13":
        return "PG-13 - Teens 13 or older";
      case "r":
        return "R - 17+ (violence & profanity)";
      case "r+":
        return "R+ - Profanity & Mild Nudity";
      case "rx":
        return "Rx - Hentai";
      default:
        return "Unknown Rating";
    }
  }

  private transformResponse(res: AnimeNode | null) {
    if (!res) return undefined;

    const { my_list_status, related_anime, ...anime } = res;

    return {
      ...anime,
      media_type: anime.media_type.toUpperCase(),
      rating: this.formatRating(anime.rating ?? ""),
      season: `${anime.start_season?.season.replace(/^.{0,1}/g, (s) => s.toUpperCase())} ${anime.start_season?.year}`,
      average_episode_duration:
        anime.average_episode_duration &&
        `${Math.floor(anime.average_episode_duration / 60)} min per ep`,
      airingStatus: anime.status
        .replace(/_/g, " ")
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" "),
      totalEpisodes: anime.num_episodes || "???",
      genreString: anime.genres.map((genre) => genre.name).join(", "),
      studiosString: anime.studios.map((studio) => studio.name).join(", "),
      num_scoring_users: anime.num_scoring_users || 0,
      airingDate: anime.start_date
        ? `${anime.start_date} to ${anime.end_date ?? "?"}`
        : "Not aired yet",
      source: anime.source
        ?.replace(/_/g, " ")
        .replace(/^.{0,1}/g, (s) => s.toUpperCase()),
      listStatusFormatted: my_list_status
        ? my_list_status.status.charAt(0).toUpperCase() +
          my_list_status.status.slice(1).replace(/_/g, " ")
        : "Not in list",
      listStatus: my_list_status,
      relatedAnime: related_anime ?? [],
    };
  }

  async getInfo(malId: number) {
    return await this.client
      .getAnimeDetails(malId, {
        fields: [
          "my_list_status",
          "related_anime",
          "genres",
          "alternative_titles",
          "start_season",
          "start_date",
          "end_date",
          "media_type",
          "rating",
          "average_episode_duration",
          "status",
          "num_episodes",
          "studios",
          "rank",
          "num_scoring_users",
          "popularity",
          "source",
          "synopsis",
          "mean",
          "recommendations",
        ],
      })
      .then((data) => this.transformResponse(data));
  }

  async getTrailer(malId: number) {
    return await Jikan4.anime(malId)
      .info()
      .then((res) => res.data.trailer.embed_url);
  }

  async getContinueWatching({ username }: { username: string }) {
    if (!this.isLoggedIn) {
      throw new Error("Not logged in");
    }

    const currentlyWatchingAnimeList = await this.getAnimeList({
      username,
      page: 1,
      limit: 18,
      status: "watching",
    });

    const continueWatchingAnime = await Promise.all(
      currentlyWatchingAnimeList.data.map(async (anime) => {
        const scraper = new HiAnimeScraper();
        const animeId = await scraper.getHiAnimeIdFromMalId(anime.node.id);

        if (!animeId) return null;

        const totalEpisodes = await fetch(`https://hianime.to/${animeId}`)
          .then((res) => res.text())
          .then(load)
          .then(($) => {
            const episodes = $(
              "#ani_detail > div > div > div.anis-content > div.anisc-detail > div.film-stats > div > div.tick-item.tick-sub",
            ).text();
            return Number(episodes);
          });

        const lastWatchedEpisode =
          anime.node.my_list_status?.num_episodes_watched ?? 0;

        return {
          animeId,
          malAnime: anime,
          totalEpisodes,
          lastWatchedEpisode,
          lastUpdated: anime.node.my_list_status?.updated_at,
        };
      }),
    );

    return continueWatchingAnime
      .filter((anime) => anime !== null)
      .filter((anime) => anime.lastWatchedEpisode !== anime.totalEpisodes)
      .sort((a, b) => {
        if (!a?.lastUpdated || !b?.lastUpdated) return 0;

        return new Date(a.lastUpdated) > new Date(b.lastUpdated) ? -1 : 1;
      });
  }
}
