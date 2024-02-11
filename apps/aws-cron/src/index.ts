import type { AWS } from '@serverless/typescript';

export default {
  cron: {
    handler: 'src/handlers/cron.main',
    events: [
      {
        schedule: 'rate(1 hour)',
      },
      {
        http: {
          method: 'get',
          path: 'cron',
        },
      },
    ],
  },
} satisfies AWS['functions'];
