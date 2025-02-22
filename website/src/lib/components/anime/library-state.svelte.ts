import type { episode } from '$lib/api/anime/types';
import type { libraryItemSchema } from '$lib/api/library/types';

export const metadataState = $state<{
	animeId: string | null;
	banner: string | null;
	library: typeof libraryItemSchema.infer | null;
	episodes: (typeof episode.infer)[];
}>({
	animeId: null,
	banner: null,
	library: null,
	episodes: []
});
