/**
 * Creates default headers for responses, including CORS configuration.
 * @param allowedOrigin The allowed origin for the response.
 * @returns The headers.
 */
export function createDefaultHeaders(allowedOrigin: string) {
  return new Headers({
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
}

/**
 * Handles preflight OPTIONS requests.
 * @param allowedOrigin The allowed origin for the response.
 * @returns The response.
 */
export function handleOptionsRequest(allowedOrigin: string) {
  return new Response(undefined, {
    status: 200,
    headers: createDefaultHeaders(allowedOrigin),
  });
}
