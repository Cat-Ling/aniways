import parse from 'node-html-parser';

const URLS = [
  'https://anitaku.to',
  'https://embtaku.pro/videos',
  'https://gogoanime3.co',
] as const;

export default async function getVideoSourceUrl(
  name: string,
  episode: number | string
) {
  const getUrl = async (
    url: string,
    // eslint-disable-next-line
    index: number
  ): Promise<string | null> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort(new Error(`Timeout for ${url}`));
      }, 3000);
      const iframe = await fetch(url, {
        signal: controller.signal,
      })
        .then(res => {
          clearTimeout(timeout);
          return res.text();
        })
        .then(html => {
          const dom = parse(html);
          return dom.querySelector('iframe')?.getAttribute('src') ?? null;
        });
      if (!iframe) {
        throw new Error(`Failed to fetch ${url} video`);
      }
      console.log(`Fetched ${url} video`);
      return iframe;
    } catch (e) {
      console.error(`Failed to fetch ${url} video`, e);
      const nextUrl = URLS.at(index + 1);
      if (nextUrl) {
        return getUrl(`${nextUrl}/${name}-episode-${episode}`, index + 1);
      }
      return null;
    }
  };

  const slug =
    episode === 'movie' ?
      `${name}-camrip-episode-1`
    : `${name}-episode-${episode}`;

  return getUrl(`${URLS[0]}/${slug}`, 0);
}
