import { Jikan4 } from "node-myanimelist";

export type CurrentAnimeSeason = {
  data: Jikan4.Types.Anime[];
} & Jikan4.Types.Pagination;

export const getCurrentAnimeSeason = async (): Promise<CurrentAnimeSeason> => {
  const currentSeason = await Jikan4.seasonNow();

  return currentSeason;
};
