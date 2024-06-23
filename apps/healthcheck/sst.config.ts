import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Tags } from "aws-cdk-lib/core";
import { SSTConfig } from "sst";
import { Api, StaticSite } from "sst/constructs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

if (!process.env.MAL_CLIENT_ID) {
  throw new Error("MAL_CLIENT_ID is required");
}

if (!process.env.AWS_CERT_ARN_AP_SOUTHEAST_1) {
  throw new Error("AWS_CERT_ARN_AP_SOUTHEAST_1 is required");
}

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

      const certificateAPSE = Certificate.fromCertificateArn(
        stack,
        "ap-southeast-1-certificate",
        process.env.AWS_CERT_ARN_AP_SOUTHEAST_1!,
      );

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
        customDomain: {
          isExternalDomain: true,
          domainName: "api.healthcheck.aniways.xyz",
          cdk: {
            certificate: certificateAPSE,
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
          VITE_APP_API_URL: api.customDomainUrl!,
        },
      });

      stack.addOutputs({
        ApiEndpoint: api.url,
        ApiDomain: api.customDomainUrl,
        WebsiteUrl: website.url,
        WebsiteDomain: website.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;
