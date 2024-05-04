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
  home: {
    handler: 'src/handlers/home.home',
    timeout: 30, // in seconds
    events: [
      {
        http: {
          method: 'GET',
          path: '/',
        },
      },
    ],
  },
} satisfies AWS['functions'];
