import { fileURLToPath } from "url";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Tags } from "aws-cdk-lib/core";
import createJiti from "jiti";
import { SSTConfig } from "sst";
import { Api, StaticSite } from "sst/constructs";

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("@aniways/db/env");
jiti("@aniways/myanimelist/env");

if (!process.env.AWS_CERT_ARN_US_EAST_1) {
  throw new Error("AWS_CERT_ARN_US_EAST_1 is required");
}

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

      const api = new Api(stack, "healthcheck-api", {
        routes: {
          "GET /": "api/check-service.handler",
        },
        defaults: {
          function: {
            environment: {
              NODE_OPTIONS: "--enable-source-maps",
              DATABASE_URL: process.env.DATABASE_URL!,
              MAL_CLIENT_ID: process.env.MAL_CLIENT_ID!,
            },
          },
        },
      });

      const certificateUSEast = Certificate.fromCertificateArn(
        stack,
        "us-east-1-certificate",
        process.env.AWS_CERT_ARN_US_EAST_1!,
      );

      const website = new StaticSite(stack, "healthcheck-website", {
        buildOutput: "dist",
        buildCommand: "bun run vite:build",
        customDomain: {
          domainName: "healthcheck.aniways.xyz",
          isExternalDomain: true,
          cdk: {
            certificate: certificateUSEast,
          },
        },
        environment: {
          VITE_APP_API_URL: api.url!,
        },
      });

      stack.addOutputs({
        ApiEndpoint: api.url,
        WebsiteDistrubution: website.url,
        WebsiteDomain: website.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;
