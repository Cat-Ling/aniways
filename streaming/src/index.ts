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
      const sources = cache.get(xrax) || (await getSources(xrax));
      sources && cache.set(xrax, sources);

      return new Response(
        JSON.stringify({
          ...sources,
          sources:
            sources?.sources.map(src => ({
              ...src,
              file: '/proxy/' + xrax + '/' + src.file.split('/').pop(),
            })) ?? [],
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // /proxy/{xrax}/{file}
    const regex = /^\/proxy\/([^/]+)\/([^/]+)$/g;
    const match = regex.exec(pathname);

    if (match) {
      const xrax = match[1];
      const file = decodeURIComponent(match[2]);
      const source = cache.get(xrax) || (await getSources(xrax));

      if (!source) {
        return new Response('Not Found', { status: 404 });
      }

      cache.set(xrax, source);

      const url = file.startsWith('http')
        ? file
        : source.sources[0].file.split('/').slice(0, -1).join('/') + '/' + file;

      return await fetch(url);
    }

    return new Response(undefined, { status: 404 });
  },
});

console.log('Server started on port 1234');
