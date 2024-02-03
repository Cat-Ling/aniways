import { RecentlyReleasedAnime } from '@data/types';

const BASE_URL = 'https://api.allanime.day/api';

type Response = {
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
};

export default async function getRecentlyReleasedAnimeFromAllAnime(
  page: number
): Promise<RecentlyReleasedAnime[]> {
  const variables = JSON.stringify({
    search: {},
    limit: 20,
    page: page,
    translationType: 'sub',
    countryOrigin: 'JP',
  });

  const extensions = JSON.stringify({
    persistedQuery: {
      version: 1,
      sha256Hash:
        '06327bc10dd682e1ee7e07b6db9c16e9ad2fd56c1b769e47513128cd5c9fc77a', // stolen from allanime dk when it will expire
    },
  });

  const url = new URL(BASE_URL);
  url.searchParams.append('variables', encodeURIComponent(variables));
  url.searchParams.append('extensions', encodeURIComponent(extensions));

  const response = await fetch(url.toString(), {
    headers: {
      Origin: 'https://allmanga.to',
    },
  })
    .then(res => res.json())
    .then(res => res.data.shows.edges as Response[]);

  return response.map(show => {
    const image = show.thumbnail.replace(
      'https:/',
      'https://wp.youtube-anime.com'
    );
    const name = show.name;
    const episode = Number(show.lastEpisodeInfo.sub.episodeString ?? '1');

    return {
      name,
      image,
      episode,
    };
  });
}
