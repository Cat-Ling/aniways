import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Tags } from "aws-cdk-lib/core";
import { SSTConfig } from "sst";
import { Function, StaticSite } from "sst/constructs";

export default {
  config: _input => ({
    name: "manga-website",
    region: "ap-southeast-1",
  }),
  stacks: app => {
    app.stack(({ stack }) => {
      Tags.of(stack).add("App", "Aniways");
      Tags.of(stack).add("Meta", `${app.stage}-${app.region}`);
      Tags.of(stack).add("Purpose", "Manga Website");

      const certificateUSEast = Certificate.fromCertificateArn(
        stack,
        "manga-certificate",
        process.env.HEALTHCHECK_AWS_SSL_CERT_ARN!
      );

      const imageProxy = new Function(stack, "image-proxy", {
        handler: "api/proxy.handler",
      });

      const website = new StaticSite(stack, "manga-website", {
        buildOutput: "dist",
        buildCommand: "bun run vite:build",
        customDomain: {
          domainName: "manga.aniways.xyz",
          isExternalDomain: true,
          cdk: {
            certificate: certificateUSEast,
          },
        },
        cdk: {
          distribution: {
            additionalBehaviors: {
              "/image/*": {
                origin: imageProxy.bind,
                allowedMethods: {
                  methods: ["GET"],
                },
              },
            },
          },
        },
      });

      stack.addOutputs({
        WebsiteDistrubution: website.url,
        WebsiteDomain: website.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;
