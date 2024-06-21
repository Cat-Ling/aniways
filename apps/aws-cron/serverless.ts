import type { AWS } from "@serverless/typescript";

import { env } from "@aniways/db/env";

import functions from "./src";

const config: AWS = {
  service: "aws-cron",
  frameworkVersion: "3",
  plugins: ["serverless-webpack", "serverless-offline"],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "ap-southeast-1",
    environment: {
      DATABASE_URL: env.DATABASE_URL,
    },
  },
  package: {
    individually: true,
  },
  functions,
};

module.exports = config;
