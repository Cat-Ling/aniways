<script lang="ts">
	import { saveSettings } from '$lib/api/settings';
	import { appState } from '$lib/context/state.svelte';

	$effect(() => {
		localStorage.setItem(
			'settings',
			JSON.stringify({
				...appState.settings,
				userId: null
			})
		);

		if (!appState.user) return;

		saveSettings(fetch, {
			...appState.settings,
			userId: appState.user.id
		});
	});
</script>
