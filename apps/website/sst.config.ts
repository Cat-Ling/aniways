/* eslint-disable turbo/no-undeclared-env-vars */
import { SSTConfig } from 'sst';
import { NextjsSite } from 'sst/constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

export default {
  config(_input) {
    return {
      name: 'aniways-website',
      region: 'ap-southeast-1',
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, 'site', {
        customDomain: {
          domainName: 'aniways.xyz',
          isExternalDomain: true,
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              'Certificate',
              process.env.AWS_CERT_ARN!
            ),
          },
        },
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          MAL_CLIENT_ID: process.env.MAL_CLIENT_ID!,
          MAL_CLIENT_SECRET: process.env.MAL_CLIENT_SECRET!,
          MAL_SECRET_KEY: process.env.MAL_SECRET_KEY!,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
