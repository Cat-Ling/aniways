import getRecentlyReleasedAnimeFromAllAnime from './allanime';
import getRecentlyReleasedAnimeFromAnitaku from './anitaku';
import getRecentlyReleasedAnimeFromGogo from './gogoanime';
import getRecentlyReleasedAnimeFromGogoTaku from './gogotaku';

export default async function getRecentlyReleasedAnime(page: number) {
  const recentlyReleasedAnime = await Promise.any([
    getRecentlyReleasedAnimeFromAllAnime(page),
    getRecentlyReleasedAnimeFromAnitaku(page),
    getRecentlyReleasedAnimeFromGogo(page),
    getRecentlyReleasedAnimeFromGogoTaku(page),
  ]);

  const nextRecentlyReleasedAnime = await Promise.any([
    getRecentlyReleasedAnimeFromAllAnime(page + 1),
    getRecentlyReleasedAnimeFromAnitaku(page + 1),
    getRecentlyReleasedAnimeFromGogo(page + 1),
    getRecentlyReleasedAnimeFromGogoTaku(page + 1),
  ]);

  return {
    anime: recentlyReleasedAnime,
    hasNext: nextRecentlyReleasedAnime.length > 0,
  };
}
