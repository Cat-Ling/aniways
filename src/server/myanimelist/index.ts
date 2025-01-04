import { env } from "@/env";
import { type AnimeNode, MALClient, type WatchStatus } from "@animelist/client";
import { Jikan4 } from "node-myanimelist";
import { load } from "cheerio";
import { type Mapper } from "../mapper";
import { z } from "zod";
import { HiAnimeScraper } from "../hianime";

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

const AnifyInfoSchema = z.object({
  bannerImage: z.string(),
});

export class MalScraper {
  private client: MALClient;
  private mapper: Mapper;
  private isLoggedIn = false;

  constructor(mapper: Mapper, accessToken?: string) {
    this.mapper = mapper;
    this.client = new MALClient(
      accessToken ? { accessToken } : { clientId: env.MAL_CLIENT_ID },
    );
    this.isLoggedIn = !!accessToken;
  }

  private ensureLoggedIn() {
    if (this.isLoggedIn) return;
    throw new Error("Not logged in");
  }

  async getAnimeListOfUser({
    username,
    page = 1,
    limit = 20,
    status = undefined,
  }: GetAnimeListArgs) {
    this.ensureLoggedIn();

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

  async getAnimeListByStatus({
    username,
    status,
    page = 1,
  }: Pick<GetAnimeListArgs, "username" | "page"> & {
    status: "watching" | "plan_to_watch";
  }) {
    this.ensureLoggedIn();

    const list = await this.getAnimeListOfUser({
      username,
      page,
      limit: 18,
      status,
    });

    const anime = await Promise.all(
      list.data.map(async (anime) => {
        const animeId = await this.mapper
          .map({ malId: anime.node.id })
          .then((mapping) => mapping.hiAnimeId);

        if (!animeId) return null;

        const totalEpisodes = await fetch(
          `${HiAnimeScraper.BASE_URL}/${animeId}`,
        )
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

    return {
      hasNext: !!list.paging.next,
      anime: anime
        .filter((anime) => anime !== null)
        .filter((anime) => anime.lastWatchedEpisode !== anime.totalEpisodes)
        .sort((a, b) => {
          if (!a?.lastUpdated || !b?.lastUpdated) return 0;

          return new Date(a.lastUpdated) > new Date(b.lastUpdated) ? -1 : 1;
        }),
    };
  }

  async updateEntry({
    malId,
    status = "watching",
    numWatchedEpisodes = 0,
    score,
  }: UpdateMalStatusArgs) {
    this.ensureLoggedIn();

    return await this.client.updateMyAnimeListStatus(malId, {
      status,
      num_watched_episodes: numWatchedEpisodes,
      score,
    });
  }

  async deleteEntry({ malId }: DeleteMalStatusArgs) {
    this.ensureLoggedIn();

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

  private getAnimeFields() {
    return [
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
    ];
  }

  private transformAnimeInfo(animeNode: AnimeNode | null) {
    if (!animeNode) return undefined;

    const { my_list_status, related_anime, ...animeInfo } = animeNode;

    return {
      ...animeInfo,
      media_type: animeInfo.media_type.toUpperCase(),
      rating: this.formatRating(animeInfo.rating ?? ""),
      season:
        animeInfo.start_season &&
        `${animeInfo.start_season?.season.replace(/^.{0,1}/g, (s) => s.toUpperCase())} ${animeInfo.start_season?.year}`,
      average_episode_duration:
        animeInfo.average_episode_duration &&
        `${Math.floor(animeInfo.average_episode_duration / 60)} min per ep`,
      airingStatus: animeInfo.status
        .replace(/_/g, " ")
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" "),
      totalEpisodes: animeInfo.num_episodes || "???",
      genreString: animeInfo.genres.map((genre) => genre.name).join(", "),
      studiosString: animeInfo.studios.map((studio) => studio.name).join(", "),
      num_scoring_users: animeInfo.num_scoring_users || 0,
      airingDate: animeInfo.start_date
        ? `${animeInfo.start_date} to ${animeInfo.end_date ?? "?"}`
        : "Not aired yet",
      source: animeInfo.source
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
      .getAnimeDetails(malId, { fields: this.getAnimeFields() })
      .then((data) => this.transformAnimeInfo(data));
  }

  async getTrailer(malId: number) {
    return await Jikan4.anime(malId)
      .info()
      .then((res) => res.data.trailer.embed_url);
  }

  getCurrentSeason(): {
    year: number;
    season: "spring" | "summer" | "fall" | "winter";
  } {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    if (month >= 0 && month <= 2) return { year, season: "winter" };
    if (month >= 3 && month <= 5) return { year, season: "spring" };
    if (month >= 6 && month <= 8) return { year, season: "summer" };
    if (month >= 9 && month <= 11) return { year, season: "fall" };

    return { year, season: "winter" };
  }

  getPrevSeason(): {
    year: number;
    season: "spring" | "summer" | "fall" | "winter";
  } {
    const { year, season } = this.getCurrentSeason();

    switch (season) {
      case "spring":
        return { year, season: "winter" };
      case "summer":
        return { year, season: "spring" };
      case "fall":
        return { year, season: "summer" };
      case "winter":
        return { year: year - 1, season: "fall" };
    }
  }

  async getSeasonalAnime(options: {
    year: number;
    season: "spring" | "summer" | "fall" | "winter";
  }) {
    const seasonalAnime = await Jikan4.season(
      options.year,
      options.season,
    ).then((anime) =>
      anime.data.sort((a, b) => {
        if (!a.popularity || !b.popularity) return 0;

        return a.popularity < b.popularity ? -1 : 1;
      }),
    );

    const animes = await Promise.all(
      seasonalAnime.map(async (anime) => {
        if (!anime.title) return null;

        const mapping = await this.mapper.map({ malId: anime.mal_id! });

        if (!mapping.hiAnimeId) return null;

        const data = await fetch(
          `https://anify.eltik.cc/info/${mapping.anilistId}`,
        )
          .then((res) => res.json())
          .then((data) => AnifyInfoSchema.safeParse(data));

        const bannerImage = data.success ? data.data.bannerImage : null;

        return {
          ...anime,
          title: anime.title,
          animeId: mapping.hiAnimeId,
          mal_id: anime.mal_id,
          anilistId: mapping.anilistId,
          bannerImage,
        };
      }),
    );

    return animes.filter((anime) => anime !== null);
  }

  async getSeasonalSpotlightAnime() {
    const currentSeason = this.getCurrentSeason();
    const prevSeason = this.getPrevSeason();

    const prevSeasonalAnime = this.getSeasonalAnime(prevSeason);
    const currentSeasonalAnime = await this.getSeasonalAnime(
      currentSeason,
    ).then((data) => data.filter((a) => a.bannerImage?.length));

    const result =
      currentSeasonalAnime.length < 10
        ? await prevSeasonalAnime.then((data) =>
            data.filter((a) => a.bannerImage?.length),
          )
        : currentSeasonalAnime;

    return result
      .map((anime) => ({
        animeId: anime.animeId,
        title: anime.title,
        rating: anime.rating,
        type: anime.type,
        episodes: anime.episodes,
        synopsis: anime.synopsis,
        bannerImage: anime.bannerImage,
        backUpImage: anime.images.webp.large_image_url,
      }))
      .slice(0, 10);
  }
}
