import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async event => {
  if (event.requestContext.http.method !== "GET") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  if (event.headers.referer !== "https://manga.aniways.xyz") {
    return {
      statusCode: 403,
      body: "Forbidden",
    };
  }

  // get image hash from url => /image/:imageHash
  const [parentPath, hash] = event.rawPath.split("/").filter(Boolean).slice(-2);

  if (parentPath !== "image" || !hash) {
    return {
      statusCode: 404,
      body: "Not Found",
    };
  }

  // convert base64 to utf-8
  const url = Buffer.from(hash, "base64").toString("utf-8");

  const blob = await fetch(url, {
    headers: {
      referer: new URL(url).origin,
    },
  });

  const blobBuffer = await blob.arrayBuffer();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": blob.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable", // 1 year
    },
    body: Buffer.from(blobBuffer).toString("base64"),
    isBase64Encoded: true,
  };
};
