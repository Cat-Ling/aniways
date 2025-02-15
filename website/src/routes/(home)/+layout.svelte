<script lang="ts">
	import RankedAnimeGrid from '$lib/components/anime/ranked-anime-grid.svelte';
	import Seasonal from '$lib/components/anime/seasonal.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const seasonalAnimes = data?.seasonalAnime;

	type Type = 'today' | 'week' | 'month';

	let selectedType: Type = $state('today');
</script>

<Seasonal {seasonalAnimes} />

<div class="mx-3 -mt-48 flex flex-col gap-8 md:mx-8">
	<section>
		<h1 class="relative z-30 font-sora text-2xl font-bold">Trending Animes</h1>
		<RankedAnimeGrid animes={data.trendingAnime} />
	</section>
	<div class="flex flex-col gap-3 md:flex-row">
		{@render children()}
		<section class="w-full max-w-md">
			<h1 class="relative z-30 mb-5 font-sora text-2xl font-bold">Popular Anime</h1>
			<RankedAnimeGrid
				animes={data.popularAnime.map((item) => ({
					id: item.id,
					poster: item.coverImage,
					jname: item.title,
					name: item.title,
					genre: [],
					anilistId: null,
					lastEpisode: item.episodes,
					malId: null
				}))}
				mode="vertical"
			/>
		</section>
	</div>
</div>
