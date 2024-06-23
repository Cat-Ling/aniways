import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Tags } from "aws-cdk-lib/core";
import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

import { env } from "~/env";

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
              env.AWS_CERT_ARN,
            ),
          },
        },
        environment: {
          DATABASE_URL: env.DATABASE_URL!,
          MAL_CLIENT_ID: env.MAL_CLIENT_ID!,
          MAL_CLIENT_SECRET: env.MAL_CLIENT_SECRET!,
          MAL_SECRET_KEY: env.MAL_SECRET_KEY!,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
        Domain: site.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;
