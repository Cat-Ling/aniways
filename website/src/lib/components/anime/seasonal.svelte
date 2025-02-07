<script lang="ts">
	import type { anilistAnime } from '$lib/api/anime/types';
	import * as Carousel from '$lib/components/ui/carousel';
	import { cn } from '$lib/utils';
	import { format } from 'date-fns';
	import Autoplay from 'embla-carousel-autoplay';
	import { Play } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import type { CarouselAPI } from '../ui/carousel/context';

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
	class="relative md:mb-12"
	opts={{ loop: true }}
	plugins={[
		Autoplay({
			stopOnMouseEnter: true,
			stopOnInteraction: false,
			active: true
		})
	]}
>
	<Carousel.Content>
		{#each seasonalAnimes as anime}
			<Carousel.Item>
				<div
					class="relative flex w-full flex-col-reverse gap-3 md:static md:grid md:grid-cols-5 md:gap-6"
				>
					<div
						class="absolute bottom-0 left-0 z-20 col-span-2 flex w-full select-none flex-col justify-center p-3 md:static md:z-0"
					>
						<h1 class="mb-2 line-clamp-1 text-xl font-bold md:mb-5 md:line-clamp-3 md:text-5xl">
							{anime.title}
						</h1>
						<div class="mb-3 hidden gap-2 md:flex">
							<span class="rounded-md bg-muted p-2 text-sm text-primary">
								{format(new Date(anime.startDate), 'MMMM yyyy') ?? '???'}
							</span>
							<span class="rounded-md bg-muted p-2 text-sm text-primary">
								{anime.type}
							</span>
							<span class="rounded-md bg-muted p-2 text-sm text-primary">
								{anime.episodes ?? '???'} episodes
							</span>
						</div>
						<p
							class={cn(
								'mb-2 line-clamp-5 hidden text-sm text-muted-foreground md:mb-5 md:[display:-webkit-box]',
								{
									italic: !anime.description
								}
							)}
						>
							{@html anime.description ?? 'No description available'}
						</p>
						<Button class="flex w-fit items-center gap-2" href="/anime/{anime.id}">
							<Play class="h-5 w-5" />
							Watch Now
						</Button>
					</div>
					<div class="relative col-span-3 aspect-video w-full overflow-hidden rounded-md">
						<div
							class="absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-t from-primary/50 to-transparent md:bg-none"
						></div>
						<img
							src={anime.bannerImage ?? anime.coverImage}
							alt={anime.title}
							class="h-full w-full rounded-lg object-cover object-center shadow-lg"
							onerror={(e) => {
								const image = e.target as HTMLImageElement;
								image.src = anime.coverImage;
							}}
						/>
					</div>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<div class="bottom-0 left-0 m-3 flex w-full justify-center md:absolute md:m-2 md:w-fit">
		{#each seasonalAnimes as _, i}
			<Button
				on:click={() => api?.scrollTo(i)}
				class="mx-1 h-2 w-2 rounded-full p-0"
				variant={i === currentSlide ? 'default' : 'secondary'}
			/>
		{/each}
	</div>
</Carousel.Root>
