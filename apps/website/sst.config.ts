import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Tags } from "aws-cdk-lib/core";
import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "aniways-website",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      Tags.of(stack).add("App", "Aniways");
      Tags.of(stack).add("Meta", `${app.stage}-${app.region}`);
      Tags.of(stack).add("Purpose", "Aniways Main Website");

      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: "aniways.xyz",
          isExternalDomain: true,
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              "Certificate",
              process.env.AWS_CERT_ARN_US_EAST_1!,
            ),
          },
        },
        environment: {
          NODE_OPTIONS: "--enable-source-maps",
          DATABASE_URL: process.env.DATABASE_URL!,
          MAL_CLIENT_ID: process.env.MAL_CLIENT_ID!,
          MAL_CLIENT_SECRET: process.env.MAL_CLIENT_SECRET!,
          MAL_SECRET_KEY: process.env.MAL_SECRET_KEY!,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
        Domain: site.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;
