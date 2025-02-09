import { getSources, type extractedSrc } from './getSources';

const cache = new Map<string, extractedSrc>();

Bun.serve({
  port: 1234,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log(
      `${req.method} ${pathname} ${req.headers.get('user-agent') ?? ''}`
    );

    if (pathname.startsWith('/info/')) {
      const xrax = pathname.split('/info/')[1];
      const cached = cache.get(xrax);
      const sources = cached ?? (await getSources(xrax));

      if (sources) cache.set(xrax, sources);

      return new Response(
        JSON.stringify({
          ...sources,
          sources:
            sources?.sources.map(src => ({
              ...src,
              file: `/proxy/${xrax}/${encodeURIComponent(
                src.file.split('/').pop()!
              )}`,
            })) ?? [],
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const regex = /^\/proxy\/([^/]+)\/([^/]+)$/;
    const match = regex.exec(pathname);

    if (match) {
      const xrax = match[1];
      const file = decodeURIComponent(match[2]);
      const cached = cache.get(xrax);
      const source = cached ?? (await getSources(xrax));

      if (!source) {
        return new Response('Not Found', { status: 404 });
      }

      cache.set(xrax, source);

      const baseUrl = new URL(source.sources[0].file);
      const finalUrl = file.startsWith('http')
        ? file
        : new URL(file, baseUrl).toString();

      return await fetch(finalUrl);
    }

    return new Response(undefined, { status: 404 });
  },
});

console.log('Server started on port 1234');
