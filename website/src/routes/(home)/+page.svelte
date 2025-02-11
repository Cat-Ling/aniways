<script lang="ts">
	import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
	import RankedAnimeGrid from '$lib/components/anime/ranked-anime-grid.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type Type = 'today' | 'week' | 'month';

	let selectedType: Type = $state('today');
</script>

<div class="mx-3 -mt-48 flex flex-col gap-8 md:mx-8">
	<section>
		<h1 class="relative z-30 font-sora text-2xl font-bold">Trending Animes</h1>
		<RankedAnimeGrid animes={data.trending} />
	</section>
	<section>
		<h1 class="relative z-30 font-sora text-2xl font-bold">Popular Anime</h1>
		<RankedAnimeGrid
			animes={data.popular.map((item) => ({
				id: item.id,
				poster: item.coverImage,
				jname: item.title,
				name: item.title,
				genre: [],
				anilistId: null,
				lastEpisode: item.episodes,
				malId: null
			}))}
		/>
	</section>
	<div class="flex flex-col gap-3 md:flex-row">
		<section>
			<h1 class="relative z-30 font-sora text-2xl font-bold">Recently Updated Anime</h1>
			<AnimeGrid
				animes={data.recentlyUpdated.items}
				pageInfo={data.recentlyUpdated.pageInfo}
				buildUrl={(anime) => `/watch/${anime.id}?episode=${anime.lastEpisode}`}
			/>
		</section>
		<section class="w-full max-w-md">
			<h1 class="relative z-30 mb-5 font-sora text-2xl font-bold">Top Anime</h1>
			<div class="flex w-full gap-2">
				{#each Object.keys(data.topAnime) as type}
					<Button
						class="flex-1 capitalize"
						variant={selectedType === type ? 'default' : 'secondary'}
						on:click={() => (selectedType = type as Type)}
					>
						{type}
					</Button>
				{/each}
			</div>
			<RankedAnimeGrid animes={data.topAnime[selectedType]} mode="vertical" />
		</section>
	</div>
</div>
