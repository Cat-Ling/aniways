<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import Empty from '$lib/assets/search.png';
  import AnimeGrid from '$lib/components/anime/anime-grid.svelte';
  import LibraryBtn from '$lib/components/anime/library-btn.svelte';
  import LibrarySync from '$lib/components/anime/library-sync.svelte';
  import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Trash } from 'lucide-svelte';
  import type { PageProps } from './$types';
  import { deleteAllFromLibrary } from '$lib/api/library';
  import { toast } from 'svelte-sonner';
  import * as Dialog from '$lib/components/ui/dialog';

  let { data }: PageProps = $props();
  let open = $state(false);
</script>

<div class="mx-3 mb-3 mt-20 md:mx-8 md:mb-8">
  <div class="mb-3 flex items-center justify-between md:flex-col md:items-start md:gap-3">
    <h1 class="font-sora text-2xl font-bold">Your Library</h1>
    <div class="flex items-center gap-3">
      <LibrarySync providers={data.providers} class="w-fit [&_span]:hidden md:[&_span]:inline" />
      <Dialog.Root bind:open>
        <Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
          <Trash />
          <span class="hidden md:inline">Clear Library</span>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Confirm Clear Library</Dialog.Title>
          </Dialog.Header>
          <Dialog.Description>
            Are you sure you want to clear your library? This action cannot be undone.
          </Dialog.Description>
          <Dialog.Footer>
            <Dialog.Close class={buttonVariants({ variant: 'secondary' })}>Cancel</Dialog.Close>
            <Button
              variant="destructive"
              onclick={async () => {
                await deleteAllFromLibrary(fetch);
                await invalidateAll();
                toast.success('Library cleared');
                open = false;
              }}
            >
              Clear Library
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>

  <Tabs.Root
    value={data.status}
    onValueChange={(value) => {
      goto(`/library?status=${value}`);
    }}
  >
    <Tabs.List class="h-fit flex-wrap justify-center">
      <Tabs.Trigger value="all">All</Tabs.Trigger>
      <Tabs.Trigger value="watching">Watching</Tabs.Trigger>
      <Tabs.Trigger value="completed">Completed</Tabs.Trigger>
      <Tabs.Trigger value="paused">Paused</Tabs.Trigger>
      <Tabs.Trigger value="dropped">Dropped</Tabs.Trigger>
      <Tabs.Trigger value="planning">Planning</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value={data.status}>
      <AnimeGrid
        animes={data.library.items.map((item) => item.anime)}
        pageInfo={data.library.pageInfo}
        buildUrl={(anime) => `/anime/${anime.id}/watch`}
      >
        {#snippet subtitle({ anime, original })}
          <span class="flex flex-col">
            <span>
              <span class="capitalize">
                {data.library.items.find((item) => item.anime.id === anime.id)?.status}
              </span>
              {data.library.items.find((item) => item.anime.id === anime.id)?.watchedEpisodes} of {original}
            </span>
            <span class="absolute right-0 top-0 m-3 flex gap-2">
              <LibraryBtn
                mode="icon"
                animeId={anime.id}
                library={data.library.items.find((item) => item.anime.id === anime.id) ?? null}
              />
            </span>
          </span>
        {/snippet}

        {#snippet emptyLayout()}
          <div class="flex flex-col items-center">
            <img
              src={Empty}
              alt="Empty"
              class="border-border mb-6 w-48 overflow-hidden rounded-full border-2"
            />
            <h2 class="font-sora font-bold">Your library is empty</h2>
            <p class="text-muted-foreground">Add an anime to your library</p>
          </div>
        {/snippet}
      </AnimeGrid>
    </Tabs.Content>
  </Tabs.Root>
</div>
