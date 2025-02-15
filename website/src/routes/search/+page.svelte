<script lang="ts">
	import { goto } from '$app/navigation';
	import SearchImage from '$lib/assets/search.png?enhanced';
	import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { RefreshCcw, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let input: HTMLInputElement | undefined = $state(undefined);
	let selected: Selected<string> | undefined = $state(undefined);

	$effect(() => {
		if (input) input.value = data.query ?? '';
		selected = data.genre
			? {
					value: data.genre,
					label: data.genre
						?.split('-')
						.map((word) => word[0].toUpperCase() + word.slice(1))
						.join(' ')
				}
			: undefined;
	});

	onMount(() => {
		if (!input) return;
		input.focus();
		const abortController = new AbortController();
		const signal = abortController.signal;

		input.addEventListener(
			'focus',
			() => {
				if (!input) return;
				input.value = input?.value;
			},
			{
				signal
			}
		);

		return () => abortController.abort();
	});
</script>

<h1 class="mx-3 mt-20 font-sora text-2xl font-bold md:mx-8">Search</h1>

<div class="mt-3 px-3 md:px-8">
	<form
		class="grid grid-cols-2 gap-3 md:flex"
		onsubmit={(e) => {
			e.preventDefault();

			const query = input?.value;
			const genre = selected?.value;

			if (!query && !genre) return;

			const searchParams = new URLSearchParams();
			if (query) searchParams.set('q', query);
			if (genre) searchParams.set('genre', genre);

			goto(`/search?${searchParams.toString()}`);
		}}
	>
		<Input
			name="q"
			type="text"
			placeholder="Search for anime..."
			class="col-span-2 md:max-w-72"
			defaultValue={data.query ?? ''}
			bind:instance={input}
		/>
		{#key selected?.value}
			<Select.Root bind:selected>
				<Select.Trigger class="col-span-2 md:max-w-72">
					<Select.Value placeholder="Genre" />
				</Select.Trigger>
				<Select.Content class="max-h-56 overflow-scroll">
					<Select.Item value="all" label="All">All</Select.Item>
					{#each data.genres as genre}
						<Select.Item value={genre.toLowerCase().replaceAll(' ', '-')} label={genre}>
							{genre}
						</Select.Item>
					{/each}
				</Select.Content>
				<Select.Input name="genre" value={selected?.value} />
			</Select.Root>
		{/key}
		<Button type="submit">
			<Search class="mr-2" />
			Search
		</Button>
		<Button href="/search" variant="secondary">
			<RefreshCcw class="mr-2" />
			Clear Filters
		</Button>
	</form>

	<AnimeGrid animes={data.results.items} pageInfo={data.results.pageInfo}>
		{#snippet emptyLayout()}
			<enhanced:img src={SearchImage} alt="Search" class="mx-auto w-72" />
			<p class="mt-3 text-center font-sora text-lg font-bold">No results found</p>
			<p class="mt-1 text-center text-muted-foreground">Try searching for something else</p>
		{/snippet}
	</AnimeGrid>
</div>
