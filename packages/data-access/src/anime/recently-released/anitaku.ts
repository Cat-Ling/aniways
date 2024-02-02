import { _RecentlyReleasedAnime } from '@ui/types';
import parse from 'node-html-parser';

const BASE_URL = 'https://anitaku.to/home.html';

export default async function getRecentlyReleasedAnimeFromAnitaku(
  page: number
): Promise<_RecentlyReleasedAnime[]> {
  // total of 20 anime per page
  const response = await fetch(`${BASE_URL}?page=${page}`).then(res =>
    res.text()
  );

  const recentlyReleased = parse(response)
    .querySelectorAll('.last_episodes li')
    .map(li => {
      const image = li.querySelector('.img img')!.getAttribute('src')!;

      const name = li.querySelector('.name')!.innerText.trim();

      const episode = Number(
        li.querySelector('.episode')!.innerText.trim().split('Episode ')[1]
      );

      return {
        name,
        image,
        episode,
      };
    });

  return recentlyReleased;
}
