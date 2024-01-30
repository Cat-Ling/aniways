import { unstable_noStore } from 'next/cache';
import parse from 'node-html-parser';

export type Anime = AwaitedReturnType<typeof getRecentlyReleasedFromGogo>[0];

// unreliable so should be used as a fallback
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

// more reliable than gogo but need testing
export const getRecentlyReleasedFromAllAnime = async (
  page: number,
  query?: string
) => {
  unstable_noStore();

  const variables = {
    search: {
      query,
    },
    limit: 30,
    page: page,
    translationType: 'sub',
    countryOrigin: 'JP',
  };

  const extensions = {
    persistedQuery: {
      version: 1,
      sha256Hash:
        '06327bc10dd682e1ee7e07b6db9c16e9ad2fd56c1b769e47513128cd5c9fc77a', // stolen from allanime dk when it will expire
    },
  };

  const res = (await fetch(
    `https://api.allanime.day/api?variables=${encodeURIComponent(
      JSON.stringify(variables)
    )}&extensions=${encodeURIComponent(JSON.stringify(extensions))}`,
    {
      headers: {
        Origin: 'https://allmanga.to',
      },
    }
  ).then(res => res.json())) as Response;

  const recentlyReleased = res.data.shows.edges.map(show => {
    // for some reason the thumbnail is not a valid url when it starts with https://cdnimg.xyz/
    const image = show.thumbnail.startsWith('https://cdnimg.xyz/')
      ? show.thumbnail.replace('https:/', 'https://wp.youtube-anime.com')
      : show.thumbnail;

    const name = show.name;
    const episode = show.lastEpisodeInfo.sub.episodeString;
    const url = `/anime/${show._id}/${encodeURIComponent(
      name.replace(/ /g, '-')
    )}/${episode}`;

    return {
      name,
      image,
      episode,
      url,
    };
  });

  return recentlyReleased;
};

type Args = {
  id: string;
  name: string;
  episode: number;
};

export const getAllAnimeUrlSource = (args: Args) => {
  const { id, name, episode } = args;
  const encodedName = encodeURIComponent(name.replace(/ /g, '-')); // replace spaces with dashes + encode
  return `https://allmanga.to/bangumi/${id}/${encodedName}/p-${episode}-sub`;
};
