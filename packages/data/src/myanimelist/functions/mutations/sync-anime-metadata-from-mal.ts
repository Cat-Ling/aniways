/* eslint-disable @typescript-eslint/only-throw-error */
import { db, orm, schema } from "@aniways/db";

import { getAnimeMetadataFromMAL } from "../queries";

const NOT_FOUND = "not-found";

async function _syncAnimeMetadataFromMAL(
	accessToken: string | undefined,
	id: string,
	malId: number,
	returning = true,
) {
	const anime = await db
		.update(schema.anime)
		.set({
			malAnimeId: malId,
		})
		.where(orm.eq(schema.anime.id, id))
		.returning()
		.then(([data]) => data);

	if (!anime) throw NOT_FOUND;

	if (!returning) return;

	return await getAnimeMetadataFromMAL(accessToken, anime);
}

export const syncAnimeMetadataFromMAL = Object.assign(
	_syncAnimeMetadataFromMAL,
	{
		NOT_FOUND,
	},
);
