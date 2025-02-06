<script lang="ts">
	import { getRecentlyUpdatedAnime } from '$lib/api/anime';

	const recentlyUpdatedAnime = getRecentlyUpdatedAnime(1, 10);
</script>

{#await recentlyUpdatedAnime}
	<p>Loading...</p>
{:then anime}
	{#each anime.items as a}
		<div>
			<img src={a.poster} alt={a.jname} />
			<h2>{a.jname}</h2>
		</div>
	{/each}
{:catch error}
	<p>{error.message}</p>
{/await}
