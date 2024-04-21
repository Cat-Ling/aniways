import { getAnimeDetailsFromMyAnimeList } from '@aniways/myanimelist';

type AnimeMetadata = ReturnType<typeof getAnimeDetailsFromMyAnimeList>;

export async function getAnimeMetadataFromMALById(
  accessToken: string | undefined,
  malId: number
): AnimeMetadata {
  return await getAnimeDetailsFromMyAnimeList({
    accessToken: accessToken,
    malId,
  });
}
