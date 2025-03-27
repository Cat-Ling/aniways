<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Shuffle } from 'lucide-svelte';
  import { type PageProps } from './$types';

  let { data }: PageProps = $props();

  afterNavigate(() => {
    window.scrollTo({ top: 0 });
  });
</script>

<h1 class="font-sora mx-3 mt-20 text-2xl font-bold md:mx-8">
  {data.genre.name}
  Animes
</h1>

<div class="mt-3 flex w-full flex-col gap-4 px-3 md:flex-row md:px-8">
  <section class="col-span-4 w-full">
    <AnimeGrid animes={data.animes.items} pageInfo={data.animes.pageInfo} class="mt-0" />
  </section>
  <div class="bg-card mb-3 grid h-fit w-full max-w-md grid-cols-3 gap-3 rounded-md p-3 md:mb-8">
    <h2 class="font-sora col-span-3 text-lg font-bold">Genres</h2>
    {#each data.genres as genre}
      <Button
        href={`/genre/${genre.slug}`}
        variant={genre.slug === data.genre.slug ? 'default' : 'outline'}
      >
        {genre.name}
      </Button>
    {/each}

    <Button href="/random/{data.genre.slug}" variant="default" class="col-span-3">
      <Shuffle class="mr-2 size-5" />
      Random {data.genre.name} anime
    </Button>
  </div>
</div>
