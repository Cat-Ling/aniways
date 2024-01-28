import { unstable_noStore } from 'next/cache';
import parse from 'node-html-parser';

export type Anime = AwaitedReturnType<typeof getRecentlyReleased>[0];

export const getRecentlyReleased = async (page: number) => {
  unstable_noStore();

  // each page is 60 anime we want 30 per page
  // so we need to get the page number and divide by 2
  // if the page is even we want the second 30
  // if the page is odd we want the first 30
  const res = await fetch(
    'https://gogotaku.info/recent-release-anime?page=' + Math.ceil(page / 2)
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
    })
    .splice(page % 2 === 0 ? 30 : 0, 30);

  return recentlyReleased;
};
