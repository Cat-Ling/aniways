import { APIGatewayProxyHandler } from 'aws-lambda';
import { getRecentlyReleasedAnime } from '@aniways/data-access';

export const main: APIGatewayProxyHandler = async () => {
  const anime = await getRecentlyReleasedAnime(1);

  console.log('Recently released anime:', anime);

  const date = new Date();

  console.log('Cron ran at', date.toISOString());

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from cron', anime }),
  };
};
