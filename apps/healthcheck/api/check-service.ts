import type { APIGatewayProxyHandler } from "aws-lambda";

import { api } from "./trpc";

async function checkIfMyAnimeListIsDown() {
  let isDown = false;

  try {
    const anime = await api.myAnimeList.search.query({
      query: "naruto",
      page: 1,
    });

    if (!anime.data.length) {
      isDown = true;
    }

    await api.myAnimeList.getAnimeMetadata.query({
      malId: anime.data[0]?.mal_id ?? 0,
    });
  } catch {
    isDown = true;
  }

  return { isDown, date: new Date() };
}

async function checkIfEpisodeServiceIsDown() {
  let isDown = false;

  try {
    const { recentlyReleased } = await api.anime.recentlyReleased.query({
      page: 1,
    });

    const anime = recentlyReleased.find(anime => anime.lastEpisode !== null);

    if (!anime?.lastEpisode) throw new Error("No anime found");

    const episode = await api.episodes.getEpisodeByAnimeIdAndEpisode.query({
      animeId: anime.id,
      episode: Number(anime.lastEpisode),
    });

    await api.episodes.scrapeVideoUrl.query({ slug: episode?.slug ?? "" });
    await api.episodes.getEpisodesOfAnime.query({ animeId: anime.id });
  } catch {
    isDown = true;
  }

  return { isDown, date: new Date() };
}

async function checkIfWebsiteIsDown() {
  let isDown = false;

  try {
    const response = await fetch("https://aniways.xyz/api/healthcheck", {
      headers: {
        // eslint-disable-next-line no-restricted-properties
        Authorization: process.env.HEALTHCHECK_KEY ?? "",
      },
    });

    if (!response.ok) {
      isDown = true;
    }

    const json = (await response.json()) as { success: boolean };

    if (!json.success) {
      isDown = true;
    }
  } catch {
    isDown = true;
  }

  return { isDown, date: new Date() };
}

export const handler: APIGatewayProxyHandler = async () => {
  const [isMyAnimeListDown, isEpisodeServiceDown, isWebsiteDown] =
    await Promise.all([
      checkIfMyAnimeListIsDown(),
      checkIfEpisodeServiceIsDown(),
      checkIfWebsiteIsDown(),
    ]);

  if (
    isMyAnimeListDown.isDown ||
    isEpisodeServiceDown.isDown ||
    isWebsiteDown.isDown
  ) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Services are down",
        success: false,
        dependencies: {
          myAnimeList: isMyAnimeListDown,
          episodes: isEpisodeServiceDown,
          website: isWebsiteDown,
        },
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "All Services are running",
      success: true,
      dependencies: {
        myAnimeList: isMyAnimeListDown,
        episodes: isEpisodeServiceDown,
        website: isWebsiteDown,
      },
    }),
  };
};
