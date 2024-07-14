import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Tags } from "aws-cdk-lib/core";
import { SSTConfig } from "sst";
import { StaticSite } from "sst/constructs";

if (!process.env.HEALTHCHECK_AWS_SSL_CERT_ARN) {
  throw new Error("HEALTHCHECK_AWS_SSL_CERT_ARN is required");
}

export default {
  config: _input => ({
    name: "aniways-cdn",
    region: "ap-southeast-1",
  }),
  stacks: app => {
    app.stack(({ stack }) => {
      Tags.of(stack).add("App", "Aniways");
      Tags.of(stack).add("Meta", `${app.stage}-${app.region}`);
      Tags.of(stack).add("Purpose", "Aniways CDN");

      const cdnCert = Certificate.fromCertificateArn(
        stack,
        "cdn-certificate",
        process.env.HEALTHCHECK_AWS_SSL_CERT_ARN!
      );

      const cdn = new StaticSite(stack, "cdn", {
        path: "assets",
        customDomain: {
          domainName: "cdn.aniways.xyz",
          isExternalDomain: true,
          cdk: {
            certificate: cdnCert,
          },
        },
      });

      stack.addOutputs({
        WebsiteDistrubution: cdn.url,
        WebsiteDomain: cdn.customDomainUrl,
      });
    });
  },
} satisfies SSTConfig;
