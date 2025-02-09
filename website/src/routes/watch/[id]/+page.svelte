<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import Metadata from '$lib/components/anime/metadata.svelte';
	import OtherAnimeSections from '$lib/components/anime/other-anime-sections.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { type PageProps } from './$types';
	import * as Dialog from '$lib/components/ui/dialog';

	let { data }: PageProps = $props();

	onMount(() => {
		const searchParams = page.url.searchParams;
		searchParams.set('episode', data.query.episode.toString());
		searchParams.set('key', data.query.key);
		searchParams.set('server', `${data.query.type}_${data.query.server}`);
		replaceState(`/watch/${data.query.id}?${searchParams.toString()}`, {});
	});
</script>

<div class="mb-3 mt-20 px-3 md:mb-8 md:px-8">
	<div class="flex flex-col-reverse gap-2 md:flex-row">
		<div class="mt-3 flex w-full max-w-md flex-col gap-2 md:mt-0 md:w-1/5">
			<div class="rounded-md bg-card p-3 md:hidden">
				<h3 class="mb-3 font-sora text-xl font-bold">Episodes</h3>
				<Dialog.Root>
					<Dialog.Trigger class={cn('w-full', buttonVariants({ variant: 'outline' }))}>
						<span class="mr-1 text-muted-foreground">Episode {data.query.episode}</span>
						-
						<span class="ml-1 font-sora">
							{data.data.episodes.find((ep) => ep.number === data.query.episode)?.title}
						</span>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Title>Select Episode</Dialog.Title>
						{@render episode('block bg-background', 'hidden')}
					</Dialog.Content>
				</Dialog.Root>
			</div>
			{@render episode()}
			<div class="w-full flex-1 rounded-md bg-card">
				<h3 class="p-3 font-sora text-xl font-bold">Servers</h3>
				<div class="grid grid-cols-5 gap-2 p-3">
					{#if data.data.servers.filter((server) => server.type === 'sub').length > 0}
						<h4 class="font-sora">Sub:</h4>
					{/if}
					{#each data.data.servers.filter((server) => server.type === 'sub') as server}
						<Button
							href="/watch/{data.query.id}?episode={data.query.episode}?key={data.query
								.key}&server={`${server.type}_${server.serverName}`}"
							variant="outline"
							size="sm"
							class={cn(
								'col-span-2',
								server.serverName === data.query.server &&
									server.type === data.query.type &&
									'border-primary'
							)}
						>
							{server.serverName}
						</Button>
					{/each}
					{#if data.data.servers.filter((server) => server.type === 'dub').length > 0}
						<h4 class="font-sora">Dub:</h4>
					{/if}
					{#each data.data.servers.filter((server) => server.type === 'dub') as server}
						<Button
							href="/watch/{data.query.id}?episode={data.query.episode}?key={data.query
								.key}&server={`${server.type}_${server.serverName}`}"
							variant="outline"
							size="sm"
							class={cn(
								'col-span-2',
								server.serverName === data.query.server &&
									server.type === data.query.type &&
									'border-primary'
							)}
						>
							{server.serverName}
						</Button>
					{/each}
				</div>
			</div>
		</div>
		<div class="aspect-video w-full flex-1 rounded-md bg-card"></div>
	</div>
</div>

<Metadata anime={data.data.anime} />

<div class="mb-5"></div>

<OtherAnimeSections
	animeId={data.query.id}
	seasonsAndRelatedAnimes={data.data.otherAnimeSections}
/>

{#snippet episode(className?: string | undefined, h3ClassName?: string | undefined)}
	<div
		class={cn(
			'hidden h-full max-h-[512px] w-full overflow-scroll rounded-md bg-card md:block',
			className
		)}
	>
		<h3 class={cn('sticky top-0 w-full border-b bg-card p-3 font-sora font-bold', h3ClassName)}>
			Episodes
		</h3>
		{#each data.data.episodes as ep, i (ep.id + i)}
			<a
				href="/watch/{data.query.id}?episode={ep.number}&key={ep.id}"
				class={cn(
					'flex items-center border-b border-border p-3 transition last:border-b-0 hover:bg-muted',
					ep.number === data.query.episode && 'text-primary'
				)}
			>
				<span class="mr-3 text-lg font-bold">
					{ep.number}
				</span>
				{ep.title}
			</a>
		{/each}
	</div>
{/snippet}
