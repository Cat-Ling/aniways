import { sanitizeName } from "../lib/sanitize-name";

const BASE_URL = "https://api.allanime.day/api";

interface Edge {
  name: string;
  englishName: string;
  nativeName: string;
  thumbnail: string;
  lastEpisodeInfo: {
    sub: {
      episodeString: string | null;
      notes: string;
    };
  };
}

interface FetchResponse {
  data: {
    shows: {
      edges: Edge[];
    };
  };
}

export default async function getRecentlyReleasedAnimeFromAllAnime(
  page: number,
  abortSignal: AbortSignal,
) {
  const variables = encodeURIComponent(
    JSON.stringify({
      search: {},
      limit: 20,
      page: page,
      translationType: "sub",
      countryOrigin: "JP",
    }),
  );

  const extensions = encodeURIComponent(
    JSON.stringify({
      persistedQuery: {
        version: 1,
        sha256Hash:
          "06327bc10dd682e1ee7e07b6db9c16e9ad2fd56c1b769e47513128cd5c9fc77a",
      },
    }),
  );

  const response = await fetch(
    `${BASE_URL}?variables=${variables}&extensions=${extensions}`,
    {
      signal: abortSignal,
      headers: {
        Origin: "https://allmanga.to",
      },
    },
  )
    .then((res) => res.json() as unknown as FetchResponse)
    .then((res) => res.data.shows.edges);

  return response.map((show) => {
    const image = show.thumbnail.replace(
      "https:/",
      "https://wp.youtube-anime.com",
    );
    const name = show.name;
    const episode = Number(show.lastEpisodeInfo.sub.episodeString ?? "1");

    return {
      name,
      image,
      episode,
      url: `/anime/${sanitizeName(show.name)}/episodes/${episode}`,
    };
  });
}
