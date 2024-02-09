import { Jikan4 } from 'node-myanimelist';

export default async function getAnimeDetails(name: string, episode?: number) {
  // TODO: add more sources, get from gogoanime, use the data to search on mal for more accurate data

  console.log('searching for anime', name);

  const data = (
    await Jikan4.animeSearch({
      q: name,
      sfw: true,
    })
  ).data.filter(
    anime =>
      name.toLowerCase().includes('tv') || // ensure anime like "Fate/stay night" is not confused with previous seasons
      anime.title?.toLowerCase() === name?.toLowerCase() ||
      anime.title_english?.toLowerCase() === name?.toLowerCase() ||
      anime.title_japanese?.toLowerCase() === name?.toLowerCase() ||
      anime.title_synonyms
        ?.map(title => title.toLowerCase())
        ?.includes(name?.toLowerCase())
  )[0];

  if (!data || !data.mal_id) {
    throw new Error('Anime not found');
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
