import { type extractedSrc } from './scrapers/getSources';
import { Route } from './route';
import { logRequest } from './utils/logger';
import { createDefaultHeaders, handleOptionsRequest } from './utils/headers';
import { handleInfoRequest } from './handlers/info';
import { handleProxyRequest } from './handlers/proxy';

export type CacheEntry = extractedSrc & {
  serverId?: string;
  xrax?: string;
  expiresAt: Date;
};

export type Cache = Map<string, CacheEntry>;

const SOURCE_CACHE: Cache = new Map();
const DEFAULT_PORT = 1234;
const DEVELOPMENT_ORIGIN = '*';
const PRODUCTION_ORIGIN = 'https://aniways.xyz';

const isDevelopment = process.env.NODE_ENV === 'development';
const allowedOrigin = isDevelopment ? DEVELOPMENT_ORIGIN : PRODUCTION_ORIGIN;

/**
 * Represents a server route for handling requests.
 */
const routes: Route[] = [
  new Route('/info/:serverId', async (req, params) => {
    const serverId = params.serverId;
    return handleInfoRequest(serverId, SOURCE_CACHE, allowedOrigin);
  }),
  new Route('/proxy/:xrax/:file', async (req, params) => {
    const xrax = params.xrax;
    const file = decodeURIComponent(params.file);
    return handleProxyRequest(xrax, file, SOURCE_CACHE, allowedOrigin);
  }),
];

async function removeExpiredCacheEntries() {
  const now = new Date();
  for (const [key, entry] of SOURCE_CACHE.entries()) {
    if (entry.expiresAt < now) {
      SOURCE_CACHE.delete(key);
    }
  }
}

/**
 * Handles incoming requests and routes them to the appropriate handler.
 * @param req The request to handle.
 * @returns The response.
 */
async function handleRequest(req: Request): Promise<Response> {
  logRequest(req);

  if (req.method === 'OPTIONS') {
    return handleOptionsRequest(allowedOrigin);
  }

  // Remove expired cache entries
  await removeExpiredCacheEntries();

  for (const route of routes) {
    const response = await route.handle(req);
    if (response) {
      return response;
    }
  }

  return new Response(undefined, {
    status: 404,
    headers: createDefaultHeaders(allowedOrigin),
  });
}

/**
 * Creates a Bun server to handle requests.
 */
export const startServer = () => {
  Bun.serve({
    port: DEFAULT_PORT,
    fetch: async (req: Request) => {
      try {
        return await handleRequest(req);
      } catch (error) {
        console.error('Error handling request:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    },
  });

  console.log(`Server running on port ${DEFAULT_PORT}`);
};
