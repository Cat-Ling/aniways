<script lang="ts">
	import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="mt-20 px-3 pb-3 md:px-8 md:pb-8">
	<h1 class="font-sora text-2xl font-bold">History</h1>
	<p class="mt-2 font-sora text-base">
		All the history of anime you have watched will be displayed here.
	</p>
	<AnimeGrid
		animes={data.history.items.map((item) => item.anime)}
		pageInfo={data.history.pageInfo}
		buildUrl={(anime) => {
			const historyItem = data.history.items.find((item) => item.anime.id === anime.id);
			return `/anime/${anime.id}/watch?episode=${historyItem?.watchedEpisodes ?? 1}`;
		}}
		buildSubtitle={(anime, original) => {
			const historyItem = data.history.items.find((item) => item.anime.id === anime.id);
			return `${historyItem?.watchedEpisodes ?? 1} of ${original}`;
		}}
	/>
</div>
