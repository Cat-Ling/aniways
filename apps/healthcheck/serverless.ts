import type { AWS } from "@serverless/typescript";

import { env as dbEnv } from "@aniways/db/env";
import { env as malEnv } from "@aniways/myanimelist/env";

import functions from "./src";

const config: AWS = {
  service: "healthcheck",
  frameworkVersion: "3",
  plugins: ["serverless-webpack", "serverless-offline"],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "ap-southeast-1",
    environment: {
      DATABASE_URL: dbEnv.DATABASE_URL,
      MAL_CLIENT_ID: malEnv.MAL_CLIENT_ID,
    },
  },
  package: {
    individually: true,
  },
  functions,
};

module.exports = config;
