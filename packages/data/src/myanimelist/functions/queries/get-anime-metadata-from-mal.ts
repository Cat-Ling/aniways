import type { AnimeDetails } from "@aniways/myanimelist";
import { getAnimeDetailsFromMyAnimeList } from "@aniways/myanimelist";

export type GetAnimeMetadataOptions =
  | {
      malId: number;
    }
  | {
      title: string;
    };

export async function getAnimeMetadataFromMAL(
  accessToken: string | undefined,
  options: GetAnimeMetadataOptions
): Promise<AnimeDetails | undefined> {
  return await getAnimeDetailsFromMyAnimeList({
    accessToken: accessToken,
    ...options,
  });
}
