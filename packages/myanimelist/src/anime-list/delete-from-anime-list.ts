import { MALClient } from "@animelist/client";

export default async function deleteFromAnimeList(
	accessToken: string,
	malId: number,
) {
	const client = new MALClient({ accessToken });

	const anime = await client.deleteMyAnimeListStatus(malId);

	return anime;
}
