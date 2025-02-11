<script lang="ts">
	import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="mx-3 -mt-48 md:mx-8">
	<h1 class="relative z-30 font-sora text-2xl font-bold">Recently Updated Anime</h1>
	<AnimeGrid
		animes={data.recentlyUpdatedAnime.items}
		pageInfo={data.recentlyUpdatedAnime.pageInfo}
		buildUrl={(anime) => `/watch/${anime.id}?episode=${anime.lastEpisode}`}
	/>
</div>
