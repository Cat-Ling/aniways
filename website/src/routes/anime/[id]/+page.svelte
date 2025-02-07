<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let anime = $derived(data.anime);
</script>

<pre class="pt-16">
  {JSON.stringify(anime, null, 2)}
</pre>
