<script lang="ts">
	import type { anime as animeSchema } from '$lib/api/anime/types';

	type Props = {
		anime: typeof animeSchema.infer;
	};

	let { anime }: Props = $props();
</script>

<a href="/anime/{anime.id}" class="group block">
	<div
		class="aspect-w-2 aspect-h-3 relative overflow-hidden rounded-lg bg-gray-200 group-hover:shadow-lg"
	>
		<img src={anime.poster} alt={anime.jname} class="h-full w-full object-cover" />
	</div>
	<div class="mt-2">
		<h3 class="text-lg font-semibold">{anime.jname}</h3>
	</div>
</a>
