import type { AnimeNode } from "@animelist/client";
import { MALClient } from "@animelist/client";
import { distance } from "fastest-levenshtein";
import { Jikan4 } from "node-myanimelist";

import { env } from "../../env";

type Args = {
  accessToken: string | undefined;
} & (
  | {
      title: string;
    }
  | {
      malId: number;
    }
);

const fields = [
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
];

function formatRating(rating: string) {
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

function transformResponse(res: AnimeNode | null) {
  if (!res) return undefined;

  const { my_list_status, related_anime, ...anime } = res;

  return {
    ...anime,
    media_type: anime.media_type.toUpperCase(),
    rating: formatRating(anime.rating ?? ""),
    season: `${anime.start_season?.season.replace(/^.{0,1}/g, s => s.toUpperCase())} ${anime.start_season?.year}`,
    average_episode_duration:
      anime.average_episode_duration &&
      `${Math.floor(anime.average_episode_duration / 60)} min per ep`,
    airingStatus: anime.status
      .replace(/_/g, " ")
      .split(" ")
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" "),
    totalEpisodes: anime.num_episodes || "???",
    genreString: anime.genres.map(genre => genre.name).join(", "),
    studiosString: anime.studios.map(studio => studio.name).join(", "),
    num_scoring_users: anime.num_scoring_users || 0,
    airingDate:
      anime.start_date ?
        `${anime.start_date} to ${anime.end_date ?? "?"}`
      : "Not aired yet",
    source: anime.source
      ?.replace(/_/g, " ")
      .replace(/^.{0,1}/g, s => s.toUpperCase()),
    listStatusFormatted:
      my_list_status ?
        my_list_status.status.charAt(0).toUpperCase() +
        my_list_status.status.slice(1).replace(/_/g, " ")
      : "Not in list",
    listStatus: my_list_status,
    relatedAnime: related_anime ?? [],
  };
}

export default async function getAnimeDetails(args: Args) {
  const { accessToken } = args;

  if ("malId" in args) {
    const client = new MALClient(
      accessToken ?
        { accessToken }
      : {
          clientId: env.MAL_CLIENT_ID,
        }
    );

    return await client
      .getAnimeDetails(args.malId, { fields })
      .then(transformResponse);
  }

  console.log("Getting anime details of", args.title);

  const data = (await Jikan4.animeSearch({ q: encodeURI(args.title) })).data
    .map(anime => ({
      ...anime,
      distance: distance(anime.title ?? "", args.title),
    }))
    .sort((a, b) => a.distance - b.distance)
    .at(0);

  if (!data?.mal_id) {
    return undefined;
  }

  return await getAnimeDetails({ malId: data.mal_id, accessToken });
}
