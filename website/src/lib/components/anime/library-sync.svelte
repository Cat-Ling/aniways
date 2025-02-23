<script lang="ts">
	import { RefreshCw } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { providerSchema } from '$lib/api/auth/types';

	type Props = {
		providers: (typeof providerSchema.infer)[];
		class?: string;
	};

	let { providers, ...props }: Props = $props();
</script>

<Button class={props.class} disabled={providers.length === 0}>
	<RefreshCw />
	Pull from external services
</Button>
