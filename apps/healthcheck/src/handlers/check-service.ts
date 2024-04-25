import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  createMyAnimeListService,
  createEpisodeService,
  createAnimeService,
} from '@aniways/data';
import { client } from '../../../../packages/database/src';

async function checkIfMyAnimeListIsDown() {
  const service = createMyAnimeListService();

  let isDown = false;

  try {
    const anime = await service.searchAnimeOnMyAnimeList('naruto', 1);

    if (!anime.data.length) {
      isDown = true;
    }

    await service.getAnimeMetadataFromMyAnimeList(undefined, {
      malId: anime.data[0]?.mal_id ?? 0,
    });
  } catch (error) {
    isDown = true;
  }

  return isDown;
}

async function checkIfEpisodeServiceIsDown() {
  const service = createEpisodeService();

  let isDown = false;

  try {
    const { recentlyReleased } =
      await createAnimeService().getRecentlyReleasedAnimes(1);

    const anime = recentlyReleased.find(anime => anime.lastEpisode !== null);

    if (!anime) throw new Error('No anime found');

    await service.getEpisodeUrl(anime.id, anime.lastEpisode!);
  } catch (error) {
    isDown = true;
  }

  return isDown;
}

export const healthCheck: APIGatewayProxyHandler = async () => {
  const isMyAnimeListDown = await checkIfMyAnimeListIsDown();
  const isEpisodeServiceDown = await checkIfEpisodeServiceIsDown();

  await client.end();

  if (isMyAnimeListDown || isEpisodeServiceDown) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Services are down',
        success: false,
        dependencies: {
          myAnimeList: !isMyAnimeListDown,
          episodeService: !isEpisodeServiceDown,
        },
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'All Services are running',
      success: true,
      dependencies: {
        myAnimeList: !isMyAnimeListDown,
        episodeService: !isEpisodeServiceDown,
      },
    }),
  };
};
