<script lang="ts">
	import type { anime } from '$lib/api/anime/types';
	import AnimeCard from './anime-card.svelte';

	type Props = {
		animes: (typeof anime.infer)[];
	};

	let { animes } = $props();
</script>

<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#each animes as anime}
		<AnimeCard {anime} />
	{/each}
</div>
