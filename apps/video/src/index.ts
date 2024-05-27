import type { AWS } from '@serverless/typescript';

export default {
  video: {
    handler: 'src/handlers/video.getVideo',
    events: [
      {
        http: {
          method: 'get',
          path: '/{any+}',
        }
      }
    ]
  }
} satisfies AWS['functions'];
