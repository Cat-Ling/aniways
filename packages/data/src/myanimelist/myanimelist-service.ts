import {
  AnimeDetails,
  SearchResults as MALSearchResults,
} from '@aniways/myanimelist';
import {
  addToMAL,
  deleteFromMAL,
  getAnimeListOfUser,
  getAnimeMetadataFromMAL,
  getCurrentSeasonAnimes,
  getRelatedAnime,
  searchAnimeFromMAL,
  syncAndGetAnimeMetadataFromMAL,
  syncAnimeMetadataFromMAL,
  updateAnimeInMAL,
  CurrentAnimeSeason,
} from './functions';

// prettier-ignore
export namespace MyAnimeListServiceTypes {
  export type GetAnimeListOfUser = typeof getAnimeListOfUser;
  export type GetCurrentSeasonAnimes = typeof getCurrentSeasonAnimes;
  export type GetAnimeMetadataFromMyAnimeList = typeof getAnimeMetadataFromMAL;
  export type SyncAndGetAnimeMetadataFromMyAnimeList = typeof syncAndGetAnimeMetadataFromMAL;
  export type SyncAnimeMetadataFromMyAnimeList = typeof syncAnimeMetadataFromMAL;
  export type GetRelatedAnimeFromDetails = typeof getRelatedAnime;
  export type SearchAnimeOnMyAnimeList = typeof searchAnimeFromMAL;
  export type AddAnimeToMyList = typeof addToMAL;
  export type UpdateAnimeInMyList = typeof updateAnimeInMAL;
  export type DeleteAnimeFromMyList = typeof deleteFromMAL;
  export type AnimeMetadata = AnimeDetails;
  export type SearchResults = MALSearchResults;
  export type AnimeSeason = CurrentAnimeSeason;
}

export class MyAnimeListService {
  static NOT_FOUND = 'not-found' as const;

  getAnimeListOfUser = getAnimeListOfUser;

  getCurrentSeasonAnimes = getCurrentSeasonAnimes;

  getAnimeMetadataFromMyAnimeList = getAnimeMetadataFromMAL;

  syncAndGetAnimeMetadataFromMyAnimeList = syncAndGetAnimeMetadataFromMAL;

  syncAnimeMetadataFromMyAnimeList = syncAnimeMetadataFromMAL;

  getRelatedAnimeFromDetails = getRelatedAnime;

  searchAnimeOnMyAnimeList = searchAnimeFromMAL;

  addAnimeToMyList = addToMAL;

  updateAnimeInMyList = updateAnimeInMAL;

  deleteAnimeFromMyList = deleteFromMAL;
}

export const createMyAnimeListService = () => {
  return new MyAnimeListService();
};
