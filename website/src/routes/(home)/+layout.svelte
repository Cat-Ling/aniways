<script lang="ts">
	import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
	import RankedAnimeGrid from '$lib/components/anime/ranked-anime-grid.svelte';
	import Seasonal from '$lib/components/anime/seasonal.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ChevronRight } from 'lucide-svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const seasonalAnimes = data?.seasonalAnime;
</script>

<Seasonal {seasonalAnimes} />

<div class="mx-3 -mt-72 flex flex-col md:mx-8">
	<section class="z-30 mb-8">
		<h1 class="relative z-30 font-sora text-2xl font-bold">Trending Animes</h1>
		<RankedAnimeGrid animes={data.trendingAnime} />
	</section>
	{#if data.continueWatching}
		<section class="z-30">
			<div class="flex w-full items-center justify-between">
				<h1 class="relative z-30 font-sora text-2xl font-bold">Continue Watching</h1>
				{#if data.continueWatching.pageInfo.hasNextPage}
					<Button href="/continue-watching" variant="link">
						View All
						<ChevronRight />
					</Button>
				{/if}
			</div>
			<AnimeGrid
				class="md:last:[&_a]:hidden"
				pageInfo={{
					currentPage: 1,
					totalPage: 1
				}}
				buildSubtitle={(anime) => `Episode ${anime.lastEpisode}`}
				animes={data.continueWatching.items.map((lib) => ({
					...lib.anime,
					lastEpisode: lib.watchedEpisodes + 1
				}))}
			/>
		</section>
	{/if}
	{#if data.planToWatch}
		<section class="z-30">
			<div class="flex w-full items-center justify-between">
				<h1 class="relative z-30 font-sora text-2xl font-bold">Your Plan to Watch</h1>
				{#if data.planToWatch.pageInfo.hasNextPage}
					<Button href="/plan-to-watch" variant="link">
						View All
						<ChevronRight />
					</Button>
				{/if}
			</div>
			<AnimeGrid
				class="md:last:[&_a]:hidden"
				pageInfo={{
					currentPage: 1,
					totalPage: 1
				}}
				buildSubtitle={(anime) => `Episode ${anime.lastEpisode}`}
				animes={data.planToWatch.items.map((lib) => ({
					...lib.anime,
					lastEpisode: lib.watchedEpisodes + 1
				}))}
			/>
		</section>
	{/if}
	<div class="flex flex-col gap-3 md:flex-row">
		{@render children()}
		<section class="w-full max-w-md">
			<h1 class="relative z-30 mb-5 font-sora text-2xl font-bold">Popular Anime</h1>
			<RankedAnimeGrid animes={data.popularAnime} mode="vertical" />
		</section>
	</div>
</div>
