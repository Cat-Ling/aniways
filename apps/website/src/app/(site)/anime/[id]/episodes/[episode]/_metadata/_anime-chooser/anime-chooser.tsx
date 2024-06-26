import type { FC } from "react";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

import { AnimeChooserClient } from "./anime-chooser-client";
import { searchAnimeAction } from "./search-anime-action";

interface AnimeChooserProps {
	query: string;
}

export const AnimeChooser: FC<AnimeChooserProps> = async ({ query }) => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["searchAnime", query, 1],
		queryFn: () => searchAnimeAction(query, 1),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AnimeChooserClient query={query} />
		</HydrationBoundary>
	);
};
