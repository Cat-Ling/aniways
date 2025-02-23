import { getSources } from '../scrapers/getSources';
import { createDefaultHeaders } from '../utils/headers';
import { type Cache, type CacheEntry } from '../server';

const USER_AGENTS = [
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36,gzip(gfe)',
  'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; SM-S901U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone14,6; U; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19E241 Safari/602.1',
  'Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
  'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
];

/**
 * Gets the XRAX token from the server ID.
 * @param serverId The server ID to get the XRAX token for.
 * @returns The XRAX token.
 */
async function getXraxFromServerId(serverId: string): Promise<string> {
  const response = await fetch(
    `https://hianime.to/ajax/v2/episode/sources?id=${serverId}`,
    {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent':
          USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
      },
    }
  ).then(res => res.json());

  return new URL(response.link).pathname.split('/').pop()!;
}

/**
 * Gets the streaming sources from the XRAX token.
 * @param xrax The XRAX token to get the streaming sources for.
 * @returns The streaming sources.
 */
async function getStreamingSources(xrax: string, serverId: string) {
  const response = await getSources(xrax);
  return {
    ...response,
    serverId,
    xrax,
  } as CacheEntry;
}

/**
 * Creates a response from a cache entry.
 * @param entry The cache entry to create a response from.
 * @returns The response.
 */
function createResponse(entry: CacheEntry) {
  const transformedSources = entry.sources.map(src => ({
    ...src,
    file: `/proxy/${entry.xrax}/${encodeURIComponent(
      src.file.split('/').pop()!
    )}`,
  }));

  return JSON.stringify({
    ...entry,
    sources: transformedSources,
  });
}

/**
 * Handles the /info/:xrax endpoint, retrieving and formatting source info.
 * @param serverId The server ID to get the sources for.
 * @param SOURCE_CACHE The cache to store the sources in.
 * @param allowedOrigin The allowed origin for the response.
 * @returns The response.
 */
export async function handleInfoRequest(
  serverId: string,
  SOURCE_CACHE: Cache,
  allowedOrigin: string
): Promise<Response> {
  const headers = createDefaultHeaders(allowedOrigin);
  headers.append('Content-Type', 'application/json');

  const cached = SOURCE_CACHE.values().find(
    entry => entry.serverId === serverId
  );

  if (cached) {
    const responseBody = createResponse(cached);

    return new Response(responseBody, { headers });
  }

  const xrax = await getXraxFromServerId(serverId);

  const cachedSources = SOURCE_CACHE.get(xrax);
  const sources = cachedSources ?? (await getStreamingSources(xrax, serverId));

  if (sources) {
    SOURCE_CACHE.set(xrax, sources);
  }

  const responseBody = createResponse(sources);

  return new Response(responseBody, { headers });
}
