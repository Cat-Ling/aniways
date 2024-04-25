import type { AWS } from '@serverless/typescript';

export default {
  healthCheck: {
    handler: 'src/handlers/check-service.healthCheck',
    events: [
      {
        http: {
          method: 'GET',
          path: 'healthcheck',
        },
      },
    ],
  },
} satisfies AWS['functions'];
