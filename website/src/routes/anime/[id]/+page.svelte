<script lang="ts">
	import Metadata from '$lib/components/anime/metadata.svelte';
	import OtherAnimeSections from '$lib/components/anime/other-anime-sections.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let { anime, episodes, seasonsAndRelatedAnimes } = $derived(data);
</script>

<Metadata {anime} />

<h2 class="mx-3 mt-8 font-sora text-xl font-bold md:mx-8">Episodes</h2>

<div class="mx-3 mb-3 mt-4 grid grid-cols-1 gap-4 md:mx-8 md:mb-8 md:grid-cols-2 lg:grid-cols-3">
	{#each episodes as episode}
		<Button
			variant="outline"
			class="h-fit flex-col items-start rounded-md bg-card p-3"
			href="/watch/{anime.id}?episode={episode.number}&key={episode.id}"
		>
			<p class="font-sora">
				Episode {episode.number}
			</p>
			<p class="w-full truncate text-muted-foreground">
				{episode.title === `Episode ${episode.number}` ? 'No title available' : episode.title}
			</p>
		</Button>
	{/each}
</div>

<OtherAnimeSections animeId={anime.id} {seasonsAndRelatedAnimes} />
