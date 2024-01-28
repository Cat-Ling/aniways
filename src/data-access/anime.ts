import { unstable_noStore } from 'next/cache';
import parse from 'node-html-parser';

export type Anime = AwaitedReturnType<typeof getRecentlyReleasedFromGogo>[0];

export const getRecentlyReleasedFromGogo = async (page: number) => {
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

type Response = {
  data: {
    shows: {
      pageInfo: {
        total: number;
      };
      edges: {
        _id: string;
        name: string;
        englishName: string;
        nativeName: string;
        thumbnail: string;
        lastEpisodeInfo: {
          sub: {
            episodeString: string;
            notes: string;
          };
        };
        lastEpisodeDate: {
          sub: {
            hour: number;
            minute: number;
            year: number;
            month: number;
            date: number;
          };
        };
        type: string;
        season: {
          quarter: 'Summer' | 'Spring' | 'Fall' | 'Winter';
          year: number;
        };
        score: number;
        airedStart: {
          year: number;
          month: number;
          date: number;
          hour: number;
          minute: number;
        };
        availableEpisodes: {
          sub: number;
        };
        episodeDuration: number;
        episodeCount: number;
        lastUpdateEnd: string;
      }[];
    };
  };
};

export const getRecentlyReleasedFromAllAnime = async (page: number) => {
  const res = (await fetch(
    `https://api.allanime.day/api?variables={%22search%22:{},%22limit%22:30,%22page%22:${page},%22translationType%22:%22sub%22,%22countryOrigin%22:%22JP%22}&extensions={%22persistedQuery%22:{%22version%22:1,%22sha256Hash%22:%2206327bc10dd682e1ee7e07b6db9c16e9ad2fd56c1b769e47513128cd5c9fc77a%22}}`,
    {
      headers: {
        Origin: 'https://allmanga.to',
      },
    }
  ).then(res => res.json())) as Response;

  const recentlyReleased = res.data.shows.edges.map(show => {
    const image = show.thumbnail;
    const name = show.name;
    const episode = show.lastEpisodeInfo.sub.episodeString;
    const url = show._id;

    return {
      name,
      image,
      episode,
      url: url,
    };
  });

  return recentlyReleased;
};
