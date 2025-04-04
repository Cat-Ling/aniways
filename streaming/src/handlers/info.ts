import { getSources } from '../scrapers/getSources';
import { createDefaultHeaders } from '../utils/headers';
import { type Cache, type CacheEntry } from '../server';
import { getRandomUserAgent } from '../utils/user-agent';

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
        'User-Agent': getRandomUserAgent(),
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
    raw: src.file,
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
    SOURCE_CACHE.set(xrax, {
      ...sources,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
    });
  }

  const responseBody = createResponse(sources);

  return new Response(responseBody, { headers });
}
