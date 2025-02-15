<script lang="ts">
	import type { anime } from '$lib/api/anime/types';
	import { cn } from '$lib/utils';

	type Props = {
		animes: (typeof anime.infer)[];
		mode?: 'horizontal' | 'vertical';
	};

	let { animes, mode = 'horizontal' }: Props = $props();
</script>

<div
	class={cn(
		'mt-3 flex w-full overflow-scroll overflow-y-hidden md:mt-5 md:gap-2',
		mode === 'vertical' ? 'mb-5 flex-col gap-2' : 'flex-row'
	)}
>
	{#each animes as anime, i (anime.id)}
		<a
			href="/anime/{anime.id}"
			class={cn(
				'group relative flex-shrink-0 md:rounded-md',
				mode === 'horizontal' && 'w-1/4 md:w-[calc(20%-0.5rem)] md:pl-12',
				mode === 'vertical' && 'grid grid-cols-4 rounded-md border border-border bg-secondary p-2'
			)}
		>
			<div class="flex gap-3">
				<p
					class={cn(
						'flex h-full items-center font-sora text-lg font-bold text-primary',
						mode === 'horizontal' && 'hidden'
					)}
				>
					{`0${i + 1}`.slice(-2)}
				</p>
				<div class={cn('aspect-[3/4] w-full overflow-hidden border-border md:rounded-md')}>
					<img
						src={anime.poster ?? ''}
						alt={anime.jname ?? ''}
						class={cn(
							'h-full w-full scale-110 rounded-md object-cover transition group-hover:scale-100',
							mode === 'vertical' && 'scale-100 group-hover:scale-110'
						)}
					/>
				</div>
			</div>
			<div
				class={cn(
					'col-span-3 hidden h-full flex-col justify-between px-3',
					mode === 'vertical' && 'flex'
				)}
			>
				<div>
					<h3
						class="line-clamp-2 font-sora text-sm font-bold transition group-hover:text-primary md:text-base"
					>
						{anime.jname}
					</h3>
					<p class="mt-1 text-xs text-muted-foreground md:text-sm">
						{anime.genre.join(', ')}
					</p>
				</div>
				<p class="mt-1 text-xs text-muted-foreground md:text-sm">
					{anime.lastEpisode ?? '???'} episode{(anime.lastEpisode ?? 2) > 1 ? 's' : ''}
				</p>
			</div>
			<div class={cn('contents', mode === 'vertical' && 'hidden')}>
				<div class="absolute left-0 top-0 bg-primary p-2 md:hidden">
					<p class="font-bold text-foreground">
						{`0${i + 1}`.slice(-2)}
					</p>
				</div>
				<div
					class="absolute bottom-0 left-3 hidden h-full flex-col items-center justify-end gap-4 md:flex"
				>
					<h2 class="rotate-180 truncate font-sora font-bold [writing-mode:vertical-rl]">
						{anime.jname}
					</h2>
					<p class="text-lg font-bold text-primary">
						{`0${i + 1}`.slice(-2)}
					</p>
				</div>
			</div>
		</a>
	{/each}
</div>
