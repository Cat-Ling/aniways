import { getSources, type extractedSrc } from '../scrapers/getSources';
import { createDefaultHeaders } from '../utils/headers';

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
  SOURCE_CACHE: Map<string, extractedSrc>,
  allowedOrigin: string
): Promise<Response> {
  const headers = createDefaultHeaders(allowedOrigin);
  const cachedSources = SOURCE_CACHE.get(xrax);
  const source = cachedSources ?? (await getSources(xrax));

  if (!source) {
    return new Response('Not Found', { status: 404, headers });
  }

  SOURCE_CACHE.set(xrax, source);

  const baseUrl = new URL(source.sources[0].file);
  const finalUrl = file.startsWith('http')
    ? file
    : new URL(file, baseUrl).toString();

  try {
    const response = await fetch(finalUrl);

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
