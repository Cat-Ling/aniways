/**
 * Logs the request details to the console.
 * @param req The request to log.
 */
export function logRequest(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const userAgent = req.headers.get('user-agent') ?? '';

  console.log(`${req.method} ${pathname} ${userAgent}`);
}
