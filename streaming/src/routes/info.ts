import Elysia, { t } from 'elysia';
import { redisClient } from '../config/redis';
import { getStreamingData } from '../services/stream';

export const infoRoute = new Elysia().get(
  '/info/:id',
  async ({ params: { id }, query: { type }, status }) => {
    const cacheKey = `${id}-${type}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`Cache hit: ${cacheKey}`);
        return status(200, {
          success: true,
          data: JSON.parse(cached),
        });
      }

      console.log(`Cache miss: ${cacheKey}`);
      const data = await getStreamingData(id, type);

      await redisClient.set(cacheKey, JSON.stringify(data), {
        EX: 7 * 24 * 60 * 60,
        NX: true,
      });

      return status(200, {
        success: true,
        data,
      });
    } catch (error) {
      console.error('Streaming error:', error);
      return status(500, {
        success: false,
        message: 'Failed to fetch M3U8 URL',
      });
    }
  },
  {
    params: t.Object({
      id: t.Number(),
    }),
    query: t.Object({
      type: t.Union([t.Literal('sub'), t.Literal('dub')], {
        default: 'sub',
      }),
    }),
    response: {
      200: t.Object({
        success: t.Literal(true),
        data: t.Object({
          sources: t.Object({
            file: t.String(),
          }),
          tracks: t.Array(
            t.Object({
              file: t.String(),
              label: t.Optional(t.String()),
              kind: t.Optional(t.String()),
              default: t.Optional(t.Boolean()),
            })
          ),
          intro: t.Optional(t.Object({ start: t.Number(), end: t.Number() })),
          outro: t.Optional(t.Object({ start: t.Number(), end: t.Number() })),
        }),
      }),
      500: t.Object({
        success: t.Literal(false),
        message: t.String(),
      }),
    },
  }
);
