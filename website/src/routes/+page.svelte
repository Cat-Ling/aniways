<script lang="ts">
	import Seasonal from '$lib/components/anime/seasonal.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<Seasonal seasonalAnimes={data.seasonal} />

<h2>Trending Animes</h2>
<div class="flex gap-2">
	{#each data.trending as anime}
		<div>
			<img src={anime.poster} alt={anime.jname} />
			<p>{anime.jname}</p>
		</div>
	{/each}
</div>

<h2>Popular Animes</h2>
<div class="flex gap-2">
	{#each data.popular as anime}
		<div>
			<img src={anime.bannerImage} alt={anime.title} />
			<p>{anime.title}</p>
		</div>
	{/each}
</div>

<h2>Top Animes</h2>
{#each [data.top.today, data.top.week, data.top.month] as type, i}
	<h3 class="capitalize">{['top', 'week', 'month'][i]}</h3>
	<div class="flex gap-2">
		{#each type as a}
			<div>
				<img src={a.poster} alt={a.jname} />
				<p>{a.jname}</p>
			</div>
		{/each}
	</div>
{/each}
