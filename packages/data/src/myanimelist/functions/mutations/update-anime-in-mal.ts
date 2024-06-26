import { updateAnimeList } from "@aniways/myanimelist";

export type UpdateAnimeInMALArguments = Parameters<typeof updateAnimeList>;

export async function updateAnimeInMAL(...args: UpdateAnimeInMALArguments) {
	return await updateAnimeList(...args);
}
