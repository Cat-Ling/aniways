import { APIGatewayProxyHandler } from "aws-lambda";

export const getVideo: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'html/text; charset=utf-8',
    },
    body: JSON.stringify({
      message: 'Hello from the Video service',
    }),
  }
}