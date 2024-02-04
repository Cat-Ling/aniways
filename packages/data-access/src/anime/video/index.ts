import parse from 'node-html-parser';

const URLS = [
  {
    url: 'https://anitaku.to',
    // eslint-disable-next-line no-undef
    fetchName: (dom: any) => {
      return dom.querySelector('.anime-info a[title]')?.getAttribute('title');
    },
  },
  {
    url: 'https://embtaku.pro/videos',
    // eslint-disable-next-line no-undef
    fetchName: (dom: any) => {
      return dom.querySelector('video-info-left h1')?.innerHTML;
    },
  },
  {
    url: 'https://gogoanime3.co',
    // eslint-disable-next-line no-undef
    fetchName: (dom: any) => {
      return dom.querySelector('.anime-info a[title]')?.getAttribute('title');
    },
  },
] as const;

export default async function getVideoSourceUrl(
  name: string,
  episode: number | string
) {
  const getUrl = async (
    name: string,
    episode: number | string,
    url: string,
    // eslint-disable-next-line
    fetchName: (dom: HTMLElement) => string | null,
    index: number
  ): Promise<{
    url: string | null;
    name: string | null;
  } | null> => {
    let done = false;
    try {
      new Promise((_, reject) => {
        setTimeout(() => {
          if (!done) reject('Timeout');
        }, 2000);
      });
      const iframe = await fetch(`${url}/${name}-episode-${episode}`)
        .then(res => res.text())
        .then(html => {
          const dom = parse(html);
          const name = fetchName(dom as any);
          return {
            url: dom.querySelector('iframe')?.getAttribute('src') ?? null,
            name: name ?? null,
          };
        });
      if (!iframe.url || !iframe.name) {
        throw new Error('Failed to fetch');
      }
      done = true;
      console.log(`Fetched ${url} video`);
      return iframe;
    } catch (e) {
      done = true;
      console.error(`Failed to fetch ${url} video`, e);
      const nextUrl = URLS.at(index + 1);
      if (nextUrl) {
        return getUrl(name, episode, nextUrl.url, nextUrl.fetchName, index + 1);
      }
      return null;
    }
  };

  return getUrl(name, episode, URLS[0].url, URLS[0].fetchName, 0);
}
