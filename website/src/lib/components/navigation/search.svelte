<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import { Search } from 'lucide-svelte';
	import { Button } from '../ui/button';

	let open = $state(false);
	let value = $state('');
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === '/') open = true;
		if (e.ctrlKey && e.key === 'k') open = true;
	}}
/>

<Button
	variant="ghost"
	class="rounded-full hover:bg-primary"
	size="icon"
	on:click={() => (open = true)}
>
	<Search class="size-6" />
</Button>

<Command.Dialog bind:open>
	<Command.Input placeholder="Search for animes..." bind:value />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
	</Command.List>
</Command.Dialog>
