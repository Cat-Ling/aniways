import {
  AnimeDetails,
  SearchResults as MALSearchResults,
} from '@aniways/myanimelist';
import {
  addToMAL,
  deleteFromMAL,
  getAnimeMetadataFromMAL,
  searchAnimeFromMAL,
  syncAndGetAnimeMetadataFromMAL,
  updateAnimeInMAL,
} from './functions';
import { syncAnimeMetadataFromMAL } from './functions/mutations/sync-anime-metadata-from-mal';

export namespace MyAnimeListService {
  export type GetAnimeMetadataFromMyAnimeList = typeof getAnimeMetadataFromMAL;
  export type SyncAndGetAnimeMetadataFromMyAnimeList =
    typeof syncAndGetAnimeMetadataFromMAL;
  export type SyncAnimeMetadataFromMyAnimeList =
    typeof syncAnimeMetadataFromMAL;
  export type SearchAnimeOnMyAnimeList = typeof searchAnimeFromMAL;
  export type AddAnimeToMyList = typeof addToMAL;
  export type UpdateAnimeInMyList = typeof updateAnimeInMAL;
  export type DeleteAnimeFromMyList = typeof deleteFromMAL;
  export type AnimeMetadata = AnimeDetails;
  export type SearchResults = MALSearchResults;
}

class MyAnimeListService {
  getAnimeMetadataFromMyAnimeList = async (
    accessToken: string,
    malId: number
  ) => {
    return await getAnimeMetadataFromMAL(accessToken, { malId });
  };

  syncAndGetAnimeMetadataFromMyAnimeList = syncAndGetAnimeMetadataFromMAL;

  syncAnimeMetadataFromMyAnimeList = syncAnimeMetadataFromMAL;

  searchAnimeOnMyAnimeList = searchAnimeFromMAL;

  addAnimeToMyList = addToMAL;

  updateAnimeInMyList = updateAnimeInMAL;

  deleteAnimeFromMyList = deleteFromMAL;
}

export const createMyAnimeListService = () => new MyAnimeListService();
