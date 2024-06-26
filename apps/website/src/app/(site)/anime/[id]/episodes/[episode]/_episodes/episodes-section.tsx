import { createEpisodeService } from "@aniways/data";

import { EpisodesSectionClient } from "./episodes-section-client";

interface EpisodesSidbarProps {
	animeId: string;
	currentEpisode: string;
}

export const EpisodesSection = async ({
	animeId,
	currentEpisode,
}: EpisodesSidbarProps) => {
	const { getEpisodesByAnimeId } = createEpisodeService();

	const videos = await getEpisodesByAnimeId(animeId);

	return (
		<EpisodesSectionClient
			animeId={animeId}
			episodes={videos}
			currentEpisode={currentEpisode}
		/>
	);
};
