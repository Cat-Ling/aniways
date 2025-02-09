<script lang="ts">
	import { page } from '$app/state';
</script>

<h1 class="mt-20">Watch</h1>
<h2>Id: {page.params.id}</h2>
<h2>Episode: {page.url.searchParams.get('episode')}</h2>
<h2>Key: {page.url.searchParams.get('key')}</h2>
