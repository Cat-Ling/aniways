import { fileURLToPath } from "url";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Tags } from "aws-cdk-lib/core";
import createJITI from "jiti";
import { SSTConfig } from "sst";
import { Api } from "sst/constructs";

const jiti = createJITI(fileURLToPath(import.meta.url));

jiti("@aniways/auth/env");

if (!process.env.API_AWS_SSL_CERT_ARN) {
  throw new Error("API_AWS_SSL_CERT_ARN is required");
}

export default {
  config: _input => ({
    name: "aniways-api",
    region: "ap-southeast-1",
  }),
  stacks: app => {
    app.stack(({ stack }) => {
      Tags.of(stack).add("App", "Aniways");
      Tags.of(stack).add("Meta", `${app.stage}-${app.region}`);
      Tags.of(stack).add("Purpose", "Aniways API");

      const api = new Api(stack, "trpc-api", {
        routes: {
          "GET /{proxy+}": "src/index.handler",
          "POST /{proxy+}": "src/index.handler",
        },
        customDomain: {
          domainName: "api.aniways.xyz",
          isExternalDomain: true,
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              "api-certificate",
              process.env.API_AWS_SSL_CERT_ARN!
            ),
          },
        },
        // Allow cookies to be sent from the client
        cors: {
          allowCredentials: true,
          allowHeaders: [
            "content-type",
            "cookie",
            "trpc-batch-mode",
            "x-trpc-source",
          ],
          allowOrigins: ["https://aniways.xyz", "https://manga.aniways.xyz"],
          allowMethods: ["GET", "POST"],
        },
        defaults: {
          function: {
            environment: {
              NODE_OPTIONS: "--enable-source-maps",
              DATABASE_URL: process.env.DATABASE_URL!,
              MAL_CLIENT_ID: process.env.MAL_CLIENT_ID!,
              MAL_CLIENT_SECRET: process.env.MAL_CLIENT_SECRET!,
              MAL_SECRET_KEY: process.env.MAL_SECRET_KEY!,
            },
          },
        },
      });

      stack.addOutputs({
        ApiUrl: api.url,
        Domain: api.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;
