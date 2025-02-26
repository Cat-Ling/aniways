<script lang="ts">
  import { page } from '$app/state';
  import sorry from '$lib/assets/sorry.png?enhanced';
  import { Button } from '$lib/components/ui/button';
  import { ChevronLeft, Home } from 'lucide-svelte';

  let is404 = $derived(page.status === 404);

  $effect(() => {
    console.error(page.error);
  });
</script>

<div class="mt-32 flex w-full max-w-screen-md flex-col gap-4 p-3 md:mx-auto md:p-8">
  <enhanced:img src={sorry} alt="Sorry, this page does not exist" class="mx-auto w-full" />
  {#if is404}
    <h1 class="text-center font-sora text-2xl">Sorry, this page does not exist</h1>
    <p class="text-center text-muted-foreground">
      The page you are looking for does not exist. Please check the URL and try again.
    </p>
  {:else}
    <h1 class="text-center font-sora text-2xl">Sorry, something went wrong</h1>
    <p class="text-center text-muted-foreground">
      An error occurred while trying to load this page. Please try again later.
    </p>
  {/if}
  <div class="mx-auto flex w-fit flex-col justify-center gap-2 md:flex-row">
    <Button variant="secondary" onclick={() => history.back()} class="gap-1">
      <ChevronLeft class="size-5" />
      Go back
    </Button>
    <Button href="/" class="gap-1">
      <Home class="size-5" />
      Go back to the home page
    </Button>
  </div>
</div>
