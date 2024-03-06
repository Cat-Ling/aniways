import { SSTConfig } from 'sst';
import { NextjsSite } from 'sst/constructs';
import { z } from 'zod';

const configSchema = z.object({
  MAL_CLIENT_ID: z.string(),
  MAL_CLIENT_SECRET: z.string(),
  MAL_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  REVALIDATE_KEY: z.string(),
});

export default {
  config(_input) {
    console.log(_input);
    return {
      name: 'Aniways',
      region: 'ap-southeast-1',
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const {
        MAL_CLIENT_ID,
        MAL_CLIENT_SECRET,
        MAL_SECRET_KEY,
        DATABASE_URL,
        REVALIDATE_KEY,
      } = configSchema.parse(process.env);

      const site = new NextjsSite(stack, 'site', {
        environment: {
          MAL_CLIENT_ID,
          MAL_CLIENT_SECRET,
          MAL_SECRET_KEY,
          DATABASE_URL,
          REVALIDATE_KEY,
        },
        experimental: {
          streaming: true,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
