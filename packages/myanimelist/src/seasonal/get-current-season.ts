import { Jikan4 } from 'node-myanimelist';

export const getCurrentAnimeSeason = async () => {
  const currentSeason = await Jikan4.seasonNow();

  return currentSeason;
};
