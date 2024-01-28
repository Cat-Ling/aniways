import { unstable_noStore } from 'next/cache';
import parse from 'node-html-parser';

export type Anime = AwaitedReturnType<typeof getRecentlyReleased>[0];

export const getRecentlyReleased = async (page: number) => {
  unstable_noStore();

  const res = await fetch(
    'https://gogotaku.info/recent-release-anime?page=' + page
  ).then(res => res.text());

  const recentlyReleased = parse(res)
    .querySelectorAll('.main_body .page_content li')
    .map(li => {
      const image = li
        .querySelector('.img a img')
        ?.getAttribute('data-original');
      const name = li.querySelector('.name')?.innerText.trim();
      const episode = li
        .querySelector('p.released')
        ?.innerText.trim()
        .split('Episode: ')[1];
      const url =
        li.querySelector('.name a')?.getAttribute('href')?.split('/').at(-1) +
        '-episode-' +
        episode;

      return {
        name,
        image,
        episode,
        url: url,
      };
    });

  return recentlyReleased;
};
