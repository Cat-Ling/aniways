<script lang="ts">
	import type { anime } from '$lib/api/anime/types';
	import { onMount, type Snippet } from 'svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import { Button } from '../ui/button';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	type Props = {
		animes: (typeof anime.infer)[];
		pageInfo: {
			totalPage: number;
			currentPage: number;
		};
		emptyLayout?: Snippet;
		titleLayout?: Snippet<[{ pagination: Snippet<[{ className?: string }]> }]>;
	};

	let { animes, emptyLayout, pageInfo, titleLayout }: Props = $props();
</script>

{@render titleLayout?.({ pagination })}

<div class="mb-3 mt-5 grid grid-cols-2 gap-3 md:mb-8 md:grid-cols-4 xl:grid-cols-6">
	{#if animes.length === 0}
		<div class="col-span-full">
			{#if emptyLayout}
				{@render emptyLayout()}
			{:else}
				<div class="text-center">No animes found</div>
			{/if}
		</div>
	{/if}
	{#each animes as result (result.id)}
		<a
			class="group relative overflow-hidden rounded-md border transition hover:scale-105"
			href={`/anime/${result.id}`}
		>
			<img
				src={result.poster}
				alt={result.jname}
				class="aspect-[3/4] w-full scale-105 rounded-md object-cover transition group-hover:scale-100"
			/>
			<div
				class="absolute bottom-0 left-0 top-0 flex w-full flex-col justify-end bg-gradient-to-t from-background to-transparent p-3"
			>
				<h3 class="line-clamp-2 font-sora text-sm font-bold md:text-base">
					{result.jname}
				</h3>
				<p class="mt-1 text-xs text-muted-foreground md:text-sm">{result.genre.join(', ')}</p>
				<p class="mt-1 text-xs text-muted-foreground md:text-sm">
					{result.lastEpisode ?? '???'} episode{(result.lastEpisode ?? 2) > 1 ? 's' : ''}
				</p>
			</div>
		</a>
	{/each}
</div>

{@render pagination({})}

{#snippet pagination({ className }: { className?: string })}
	<Pagination.Root
		count={pageInfo.totalPage}
		perPage={1}
		page={pageInfo.currentPage}
		let:pages
		let:currentPage
		class={cn(
			'mb-3 hidden md:mb-8 md:flex',
			{
				'md:hidden': pageInfo.totalPage <= 1
			},
			className
		)}
		onPageChange={(page) => {
			const url = new URL(window.location.href);
			url.searchParams.set('page', page.toString());
			goto(url.toString());
		}}
	>
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage == page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton />
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>

	<div
		class={cn('mb-3 flex items-center gap-2 md:hidden', {
			hidden: pageInfo.totalPage <= 1
		})}
	>
		<Button
			variant="secondary"
			class="flex w-fit flex-1 items-center gap-2"
			disabled={pageInfo.currentPage === 1}
			onclick={() => {
				const url = new URL(window.location.href);
				url.searchParams.set('page', (pageInfo.currentPage - 1).toString());
				goto(url.toString());
			}}
		>
			<ChevronLeft />
		</Button>
		<div class="h-10 rounded-md bg-card p-2">
			{pageInfo.currentPage} <span class="text-muted-foreground">/ {pageInfo.totalPage}</span>
		</div>
		<Button
			variant="secondary"
			class="flex w-fit flex-1 items-center gap-2"
			disabled={pageInfo.currentPage === pageInfo.totalPage}
			onclick={() => {
				const url = new URL(window.location.href);
				url.searchParams.set('page', (pageInfo.currentPage + 1).toString());
				goto(url.toString());
			}}
		>
			<ChevronRight />
		</Button>
	</div>
{/snippet}
