<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { providerSchema } from '$lib/api/auth/types';
  import { getRunningSyncs, pullFromMal } from '$lib/api/library';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { cn } from '$lib/utils';
  import { RefreshCw } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  type Props = {
    providers: (typeof providerSchema.infer)[];
    class?: string;
  };

  let { providers, ...props }: Props = $props();
  let runningSyncs = $state<string[]>([]);
  let open = $state(false);

  onMount(async () => {
    runningSyncs = await getRunningSyncs(fetch).then((res) => res.statuses);
  });

  $effect(() => {
    let interval = setInterval(async () => {
      if (runningSyncs.length === 0) return;
      const result = await getRunningSyncs(fetch).then((res) => res.statuses);
      if (result.length < runningSyncs.length) {
        await invalidateAll();
        toast.success('Sync completed');
      }
      runningSyncs = result;
    }, 5000);

    return () => clearInterval(interval);
  });
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    class={cn('w-full md:w-fit', buttonVariants(), props.class)}
    disabled={providers.length === 0 || runningSyncs.length > 0}
  >
    <RefreshCw class={cn(runningSyncs.length > 0 && 'animate-spin')} />
    <span>Pull Library</span>
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>Pull Library</Dialog.Title>
    <Dialog.Description>
      Select a provider to pull your library from. This action is irreversible. Any conflicts will
      be resolved in favor of the provider. Proceed with caution.
    </Dialog.Description>
    {#if providers.includes('myanimelist')}
      <Button
        variant="outline"
        onclick={async () => {
          open = false;
          const res = await pullFromMal(fetch).catch((err) => {
            toast.error(err.message);
            throw err;
          });
          toast.success('Successfully started syncing with MyAnimeList');
          if (res.syncId) runningSyncs.push(res.syncId);
        }}
      >
        <img src="/mal.svg" alt="MyAnimeList" class="size-6" />
        MyAnimeList
      </Button>
    {/if}
    {#if providers.includes('anilist')}
      <Button variant="outline">
        <img src="/anilist.svg" alt="AniList" class="size-6" />
        AniList
      </Button>
    {/if}
    {#if providers.length !== 2}
      <Button variant="secondary" href="/account">Install other providers</Button>
    {/if}
  </Dialog.Content>
</Dialog.Root>
