import { SSTConfig } from "sst";
import { Cron, Function } from "sst/constructs";

export default {
  config: (_input) => ({
    name: "sync-anime-cron",
    region: "ap-southeast-1",
  }),
  stacks: (app) => {
    app.stack(({ stack }) => {
      const syncAnimeFn = new Function(stack, "sync-anime-function", {
        handler: "src/index.syncAnimeCron",
        timeout: "300 seconds",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
        },
      });

      new Cron(stack, "anime-syncer-cron", {
        schedule: "cron(0 * * * ? *)", // Every hour
        job: syncAnimeFn,
      });
    });
  },
} satisfies SSTConfig;
