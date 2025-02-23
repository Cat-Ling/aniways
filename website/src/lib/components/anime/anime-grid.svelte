<script lang="ts">
	import { goto } from '$app/navigation';
	import type { anime } from '$lib/api/anime/types';
	import { Button } from '$lib/components/ui/button';
	import * as Pagination from '$lib/components/ui/pagination';
	import { cn } from '$lib/utils';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { type Snippet } from 'svelte';

	type Props = {
		animes: (typeof anime.infer)[];
		pageInfo: {
			totalPage: number;
			currentPage: number;
		};
		class?: string;
		buildUrl?: (anime: Props['animes'][number]) => string;
		buildSubtitle?: (anime: Props['animes'][number], original: string) => string;
		subtitle?: Snippet<[{ anime: Props['animes'][number]; original: string }]>;
		emptyLayout?: Snippet;
		titleLayout?: Snippet<[{ pagination: Snippet<[{ className?: string }]> }]>;
		onPaginationClick?: () => void;
	};

	let {
		animes,
		emptyLayout,
		pageInfo,
		titleLayout,
		buildUrl,
		buildSubtitle = (_, original) => original,
		subtitle,
		...props
	}: Props = $props();
</script>

{@render titleLayout?.({ pagination })}

<div
	class={cn(
		'mb-3 mt-5 grid w-full min-w-full grid-cols-2 gap-4 md:mb-8 md:grid-cols-5',
		props.class
	)}
>
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
			href={buildUrl?.(result) ?? `/anime/${result.id}`}
		>
			<div class="aspect-[3/4] w-full min-w-full overflow-hidden rounded-md bg-card">
				<img
					src={result.metadata?.mainPicture || result.poster}
					alt={result.jname}
					class="aspect-[3/4] w-full scale-105 rounded-md object-cover transition group-hover:scale-100"
				/>
			</div>
			<div
				class="absolute bottom-0 left-0 top-0 flex w-full flex-col justify-end bg-gradient-to-t from-background to-transparent p-3"
			>
				<h3 class="line-clamp-2 font-sora text-sm font-bold md:text-base">
					{result.jname}
				</h3>
				<p class="mt-1 hidden text-xs text-muted-foreground md:block md:text-sm">
					{result.genre.join(', ')}
				</p>
				<p class="mt-1 text-xs text-muted-foreground md:text-sm">
					{#if subtitle}
						{@render subtitle({
							anime: result,
							original: `${result.lastEpisode ?? '???'} episode${(result.lastEpisode ?? 2) > 1 ? 's' : ''}`
						})}
					{:else}
						{buildSubtitle(
							result,
							`${result.lastEpisode ?? '???'} episode${(result.lastEpisode ?? 2) > 1 ? 's' : ''}`
						)}
					{/if}
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
			goto(url.toString(), {
				noScroll: true
			});
			props.onPaginationClick?.();
		}}
	>
		{#snippet children({ pages, currentPage })}
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
		{/snippet}
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
