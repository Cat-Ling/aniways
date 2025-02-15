<script lang="ts">
	import type { anilistAnime } from '$lib/api/anime/types';
	import { Button } from '$lib/components/ui/button';
	import * as Carousel from '$lib/components/ui/carousel';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import { cn } from '$lib/utils';
	import { format } from 'date-fns';
	import Autoplay from 'embla-carousel-autoplay';
	import { Calendar, ChevronRight, Clapperboard, Play, Video } from 'lucide-svelte';

	type Props = {
		seasonalAnimes: (typeof anilistAnime.infer)[];
	};

	const { seasonalAnimes }: Props = $props();

	let api: CarouselAPI | undefined = $state();
	let currentSlide = $state(0);

	$effect(() => {
		const onSlidesChanged = () => {
			currentSlide = api?.selectedScrollSnap() ?? 0;
		};

		if (api) {
			api.on('select', onSlidesChanged);
		}

		return () => {
			api?.off('select', onSlidesChanged);
		};
	});
</script>

<Carousel.Root
	bind:api
	class="relative mb-24"
	opts={{ loop: true }}
	plugins={[
		Autoplay({
			active: true
		})
	]}
>
	<Carousel.Content>
		{#each seasonalAnimes as anime}
			<Carousel.Item class="relative h-[80dvh] w-full">
				<div
					class="absolute left-3 top-1/2 z-20 flex -translate-y-1/2 select-none flex-col justify-end p-3 md:left-8 md:w-1/2"
				>
					<h1 class="mb-2 line-clamp-1 font-sora text-3xl font-bold md:mb-5 md:text-6xl">
						{anime.title}
					</h1>
					<div class="mb-2 flex gap-2 md:mb-3">
						<span
							class="flex items-center gap-2 rounded-full bg-card p-2 text-xs text-primary md:text-base"
						>
							<Calendar />
							{format(new Date(anime.startDate), 'MMMM yyyy') ?? '???'}
						</span>
						<span
							class="flex items-center gap-2 rounded-full bg-card p-2 text-xs text-primary md:text-base"
						>
							<Clapperboard />
							{anime.type}
						</span>
						<span
							class="flex items-center gap-2 rounded-full bg-card p-2 text-xs text-primary md:text-base"
						>
							<Video />
							{anime.episodes ?? '???'} episodes
						</span>
					</div>
					<p
						class={cn('mb-5 line-clamp-2 [display:-webkit-box] md:text-lg', {
							italic: !anime.description
						})}
					>
						{@html anime.description.split('<br>').join('') ?? 'No description available'}
					</p>
					<div class="flex gap-2">
						<Button class="flex w-fit items-center gap-2" href="/anime/{anime.id}/watch">
							<Play class="h-5 w-5" />
							Watch Now
						</Button>
						<Button
							class="flex w-fit items-center gap-2"
							href="/anime/{anime.id}"
							variant="secondary"
						>
							View Details
							<ChevronRight class="h-5 w-5" />
						</Button>
					</div>
				</div>
				<div
					class="absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-t from-background to-background/15"
				></div>
				<img
					src={anime.bannerImage ?? anime.coverImage}
					alt={anime.title}
					class="h-full w-full object-cover object-center shadow-lg"
					onerror={(e) => {
						const image = e.target as HTMLImageElement;
						image.src = anime.coverImage;
					}}
				/>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<div
		class="absolute bottom-32 left-1/2 flex w-fit -translate-x-1/2 justify-center md:bottom-24 md:left-0 md:m-8 md:translate-x-0"
	>
		{#each seasonalAnimes as _, i}
			<Button
				on:click={() => api?.scrollTo(i)}
				class="mx-1 size-3 rounded-full p-0"
				variant={i === currentSlide ? 'default' : 'outline'}
			/>
		{/each}
	</div>
</Carousel.Root>
