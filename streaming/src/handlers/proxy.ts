import { getSources } from '../scrapers/getSources';
import type { CacheEntry } from '../server';
import { createDefaultHeaders } from '../utils/headers';
import { getRandomUserAgent } from '../utils/user-agent';

/**
 * Handles the /proxy/:xrax/:file endpoint, proxying requests to the source file.
 * @param xrax The XRAX to get the sources for.
 * @param file The file to proxy.
 * @param SOURCE_CACHE The cache to store the sources in.
 * @param allowedOrigin The allowed origin for the response.
 * @returns The response.
 */
export async function handleProxyRequest(
  xrax: string,
  file: string,
  SOURCE_CACHE: Map<string, CacheEntry>,
  allowedOrigin: string
): Promise<Response> {
  const headers = createDefaultHeaders(allowedOrigin);
  const cachedSources = SOURCE_CACHE.get(xrax);
  const source = cachedSources ?? (await getSources(xrax));

  if (!source) {
    return new Response('Not Found', { status: 404, headers });
  }

  if (!cachedSources) {
    SOURCE_CACHE.set(xrax, {
      ...source,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
    });
  }

  const baseUrl = new URL(source.sources[0].file);
  const finalUrl = file.startsWith('http')
    ? file
    : new URL(file, baseUrl).toString();

  try {
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        Referer: `https://megacloud.tv/embed-2/e-1/${xrax}?k=1`,
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Accept: '*/*',
      },
    });

    headers.append('Content-Type', response.headers.get('content-type') ?? '');
    headers.append(
      'Content-Length',
      response.headers.get('content-length') ?? ''
    );
    headers.append(
      'Content-Disposition',
      response.headers.get('content-disposition') ?? ''
    );
    headers.append('Cache-Control', 'public, max-age=31536000');

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error(`Error fetching ${finalUrl}:`, error);
    return new Response('Internal Server Error', { status: 500, headers });
  }
}
