import { APIGatewayProxyHandler } from 'aws-lambda';

export const main: APIGatewayProxyHandler = async () => {
  const date = new Date();

  console.log('Cron ran at', date.toISOString());

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from cron' }),
  };
};
