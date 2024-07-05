import { fileURLToPath } from "url";
import { Tags } from "aws-cdk-lib/core";
import createJITI from "jiti";
import { SSTConfig } from "sst";
import { Cron, Function } from "sst/constructs";

const jiti = createJITI(fileURLToPath(import.meta.url));

jiti("@aniways/db/env");
jiti("@aniways/myanimelist/env");

export default {
  config: _input => ({
    name: "sync-anime-cron",
    region: "ap-southeast-1",
  }),
  stacks: app => {
    app.stack(({ stack }) => {
      Tags.of(stack).add("App", "Aniways");
      Tags.of(stack).add("Meta", `${app.stage}-${app.region}`);
      Tags.of(stack).add("Purpose", "Sync Anime Data");

      const syncAnimeFn = new Function(stack, "sync-anime-function", {
        handler: "src/cron/main.handler",
        timeout: "300 seconds",
        environment: {
          NODE_OPTIONS: "--enable-source-maps",
          DATABASE_URL: process.env.DATABASE_URL!,
          MAL_CLIENT_ID: process.env.MAL_CLIENT_ID!,
        },
      });

      new Cron(stack, "anime-syncer-cron", {
        schedule: "cron(0 * * * ? *)", // Every hour
        job: syncAnimeFn,
      });
    });
  },
} satisfies SSTConfig;
