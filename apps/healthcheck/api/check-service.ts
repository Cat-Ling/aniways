import type { APIGatewayProxyHandler } from "aws-lambda";

import {
  createAnimeService,
  createEpisodeService,
  createMyAnimeListService,
} from "@aniways/data";

async function checkIfMyAnimeListIsDown() {
  const service = createMyAnimeListService();

  let isDown = false;

  try {
    const anime = await service.searchAnimeOnMyAnimeList("naruto", 1);

    if (!anime.data.length) {
      isDown = true;
    }

    await service.getAnimeMetadataFromMyAnimeList(undefined, {
      malId: anime.data[0]?.mal_id ?? 0,
    });
  } catch {
    isDown = true;
  }

  return { isDown, date: new Date() };
}

async function checkIfEpisodeServiceIsDown() {
  const service = createEpisodeService();

  let isDown = false;

  try {
    const { recentlyReleased } =
      await createAnimeService().getRecentlyReleasedAnimes(1);

    const anime = recentlyReleased.find((anime) => anime.lastEpisode !== null);

    if (!anime?.lastEpisode) throw new Error("No anime found");

    await service.getEpisodeUrl(anime.id, anime.lastEpisode);
    await service.getEpisodesByAnimeId(anime.id);
  } catch {
    isDown = true;
  }

  return { isDown, date: new Date() };
}

async function checkIfWebsiteIsDown() {
  let isDown = false;

  try {
    const response = await fetch("https://aniways.xyz/api/healthcheck");

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
      statusCode: 500,
      body: JSON.stringify({
        message: "Services are down",
        success: false,
        dependencies: {
          myAnimeList: !isMyAnimeListDown,
          episodeService: !isEpisodeServiceDown,
          website: !isWebsiteDown,
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
        myAnimeList: !isMyAnimeListDown,
        episodeService: !isEpisodeServiceDown,
        website: !isWebsiteDown,
      },
    }),
  };
};
