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
} from './functions';

// prettier-ignore
export namespace MyAnimeListService {
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
}

class MyAnimeListService {
  private accessToken: string | undefined = undefined;

  constructor(acessToken: string | undefined) {
    this.accessToken = acessToken;
  }

  private ensureAccessToken<T extends Function>(
    // eslint-disable-next-line no-unused-vars
    fn: (accessToken: string) => T
  ) {
    if (!this.accessToken) {
      throw new Error('Access token is required to use this function');
    }

    return fn(this.accessToken);
  }

  getAnimeListOfUser = this.ensureAccessToken(token =>
    getAnimeListOfUser.bind(null, token)
  );

  getCurrentSeasonAnimes = getCurrentSeasonAnimes;

  getAnimeMetadataFromMyAnimeList = async (malId: number) => {
    return await getAnimeMetadataFromMAL(this.accessToken, { malId });
  };

  syncAndGetAnimeMetadataFromMyAnimeList = syncAndGetAnimeMetadataFromMAL.bind(
    null,
    this.accessToken
  );

  syncAnimeMetadataFromMyAnimeList = syncAnimeMetadataFromMAL.bind(
    null,
    this.accessToken
  );

  getRelatedAnimeFromDetails = getRelatedAnime;

  searchAnimeOnMyAnimeList = searchAnimeFromMAL;

  addAnimeToMyList = this.ensureAccessToken(token =>
    addToMAL.bind(null, token)
  );

  updateAnimeInMyList = this.ensureAccessToken(token =>
    updateAnimeInMAL.bind(null, token)
  );

  deleteAnimeFromMyList = this.ensureAccessToken(token =>
    deleteFromMAL.bind(null, token)
  );
}

export const createMyAnimeListService = (accessToken?: string) => {
  return new MyAnimeListService(accessToken);
};
