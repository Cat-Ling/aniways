import { Tags } from "aws-cdk-lib/core";
import { SSTConfig } from "sst";

export default {
  config: (_input) => ({
    name: "healthcheck",
    region: "ap-southeast-1",
  }),
  stacks: (app) => {
    app.stack(({ stack }) => {
      Tags.of(stack).add("App", "Aniways");
      Tags.of(stack).add("Meta", `${app.stage}-${app.region}`);
      Tags.of(stack).add("Purpose", "Health Check");
    });
  },
} satisfies SSTConfig;
