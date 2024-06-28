import { fileURLToPath } from "url";
import { Tags } from "aws-cdk-lib/core";
import createJITI from "jiti";
import { SSTConfig } from "sst";
import { Cron, Function } from "sst/constructs";

const jiti = createJITI(fileURLToPath(import.meta.url));

jiti("@aniways/db/env");

export default {
  config: _input => ({
    name: "seasonal-anime-cron",
    region: "ap-southeast-1",
  }),
  stacks: app => {
    app.stack(({ stack }) => {
      Tags.of(stack).add("App", "Aniways");
      Tags.of(stack).add("Meta", `${app.stage}-${app.region}`);
      Tags.of(stack).add("Purpose", "Seasonal Anime Cron");

      const syncSeasonalAnimeFn = new Function(
        stack,
        "sync-seasonal-anime-function",
        {
          handler: "src/cron.syncSeasonalAnime",
          timeout: "30 seconds",
          environment: {
            NODE_OPTIONS: "--enable-source-maps",
            DATABASE_URL: process.env.DATABASE_URL!,
          },
        }
      );

      new Cron(stack, "seasonal-anime-cron", {
        schedule: "cron(0 0 ? * 2 *)", // Every Monday at 00:00
        job: syncSeasonalAnimeFn,
      });
    });
  },
} satisfies SSTConfig;
