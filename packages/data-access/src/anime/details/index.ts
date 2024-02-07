import { Jikan4 } from 'node-myanimelist';

export default async function getAnimeDetails(name: string, episode?: number) {
  // TODO: add more sources, get from gogoanime, use the data to search on mal for more accurate data

  const data = (
    await Jikan4.animeSearch({
      q: name,
      limit: 1,
      sfw: true,
      status: 'airing',
    })
  ).data.at(0);

  if (!data || !data.mal_id) {
    throw new Error('Anime not found');
  }

  const anime = Jikan4.anime(data.mal_id);

  const episodes = await anime.episodes();

  const currentEpisode = episode ? (await anime.episode(episode)).data : null;

  return {
    ...data,
    episodes: [
      ...new Set([
        ...episodes.data,
        ...(currentEpisode ? [currentEpisode] : []),
      ]),
    ],
  };
}
