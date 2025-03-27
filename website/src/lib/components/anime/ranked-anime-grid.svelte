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
    'mt-3 flex w-full overflow-y-hidden md:mt-5 md:gap-2',
    mode === 'vertical' ? 'mb-5 flex-col gap-2' : 'flex-row overflow-x-scroll'
  )}
>
  {#each animes as anime, i (anime.id)}
    <a
      href="/anime/{anime.id}"
      class={cn(
        'group relative flex-shrink-0 md:rounded-md',
        mode === 'horizontal' && 'w-1/4 md:w-[calc(20%-0.5rem)] md:pl-12',
        mode === 'vertical' && 'border-border bg-secondary grid grid-cols-4 rounded-md border p-2'
      )}
    >
      <div class="flex gap-3">
        <p
          class={cn(
            'font-sora text-primary flex h-full items-center text-lg font-bold',
            mode === 'horizontal' && 'hidden'
          )}
        >
          {`0${i + 1}`.slice(-2)}
        </p>
        <div class={cn('border-border aspect-[3/4] w-full overflow-hidden md:rounded-md')}>
          <img
            src={anime.metadata?.mainPicture || anime.poster}
            alt={anime.jname ?? ''}
            loading="lazy"
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
            class="font-sora group-hover:text-primary line-clamp-2 text-sm font-bold transition md:text-base"
          >
            {anime.jname}
          </h3>
          <p class="text-muted-foreground mt-1 text-xs md:text-sm">
            {anime.genre.join(', ')}
          </p>
        </div>
        <p class="text-muted-foreground mt-1 text-xs md:text-sm">
          {anime.lastEpisode ?? '???'} episode{(anime.lastEpisode ?? 2) > 1 ? 's' : ''}
        </p>
      </div>
      <div class={cn('contents', mode === 'vertical' && 'hidden')}>
        <div class="bg-primary absolute left-0 top-0 p-2 md:hidden">
          <p class="text-foreground font-bold">
            {`0${i + 1}`.slice(-2)}
          </p>
        </div>
        <div
          class="absolute bottom-0 left-3 hidden h-full flex-col items-center justify-end gap-4 md:flex"
        >
          <h2 class="font-sora rotate-180 truncate font-bold [writing-mode:vertical-rl]">
            {anime.jname}
          </h2>
          <p class="text-primary text-lg font-bold">
            {`0${i + 1}`.slice(-2)}
          </p>
        </div>
      </div>
    </a>
  {/each}
</div>
