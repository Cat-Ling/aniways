/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aniways",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Cron("aniways-mapper-cron", {
      function: {
        handler: "scripts/map.handler",
        timeout: "10 minutes",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
        },
      },
      schedule: "rate(1 day)",
    });
  },
});
