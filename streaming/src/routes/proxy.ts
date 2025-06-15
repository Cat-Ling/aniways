import Elysia, { t } from 'elysia';
import { allowedExtensions, LineTransform } from '../services/line-transform';
import axios from 'axios';

export const proxyRoute = new Elysia().get(
  '/proxy',
  async ({ query: { url }, status, set }) => {
    const isStaticFiles = allowedExtensions.some(ext => url.endsWith(ext));
    const baseUrl = url.replace(/[^/]+$/, '');

    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        Accept: '*/*',
        Referer: 'https://megaplay.buzz/api',
        Origin: 'https://megaplay.buzz',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });

    for (const [key, value] of Object.entries(response.headers)) {
      set.headers[key] = value;
    }

    if (!isStaticFiles) delete set.headers['content-length'];
    set.headers['access-control-allow-origin'] = '*';
    set.headers['access-control-allow-headers'] = '*';
    set.headers['access-control-allow-methods'] = '*';

    if (isStaticFiles) {
      return response.data;
    }

    const transform = new LineTransform(baseUrl);
    response.data.pipe(transform);

    return transform;
  },
  {
    query: t.Object({
      url: t.String(),
    }),
  }
);
