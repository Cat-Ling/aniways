import { scrapeVideoHTML } from '@aniways/web-scraping';

export async function getEpisodeHTML(url: string) {
  const html = await scrapeVideoHTML(url);

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}
