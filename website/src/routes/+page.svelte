<script lang="ts">
	import { type PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

{#each data.items as item}
	<div>{item.name}</div>
{/each}
