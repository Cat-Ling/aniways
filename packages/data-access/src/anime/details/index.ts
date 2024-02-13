import { Jikan4 } from 'node-myanimelist';

export default async function getAnimeDetails(name: string, episode?: number) {
  // TODO: add more sources, get from gogoanime, use the data to search on mal for more accurate data

  console.log('searching for anime', name);

  const leven = (await import('leven')).default;

  const data = (
    await Jikan4.animeSearch({
      q: name,
      sfw: true,
    })
  ).data
    .map(anime => ({
      ...anime,
      distance: Math.min(
        leven(name, anime.title ?? ''),
        leven(name, anime.title_english ?? ''),
        leven(name, anime.title_japanese ?? ''),
        ...(anime.title_synonyms?.map(syn => leven(name, syn)) ?? [])
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .shift();

  if (!data || !data.mal_id) {
    return undefined;
  }

  const anime = Jikan4.anime(data.mal_id);

  const episodes = await anime.episodes();

  const currentEpisode = episode ? (await anime.episode(episode)).data : null;

  if (
    episodes.data.length &&
    currentEpisode &&
    episodes.data.every(ep => ep.mal_id !== currentEpisode.mal_id)
  ) {
    episodes.data.push(currentEpisode);
  }

  return {
    ...data,
    episodes: episodes.data.map(ep => ({
      ...ep,
      current: currentEpisode?.mal_id === ep.mal_id,
    })),
  };
}
