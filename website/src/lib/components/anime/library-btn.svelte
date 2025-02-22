<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { saveToLibrary, deleteFromLibrary } from '$lib/api/library';
	import {
		libraryStatusSchema,
		updateLibrarySchema,
		type libraryItemSchema
	} from '$lib/api/library/types';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Bookmark, Loader2, Pencil } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { arktypeClient } from 'sveltekit-superforms/adapters';
	import { metadataState } from './library-state.svelte';

	let { animeId, library } = $derived(metadataState);

	let open = $state(false);

	const addToLibrary = async () => {
		if (!animeId) return;

		// Optimistic update
		metadataState.library = {
			animeId,
			status: 'watching',
			watchedEpisodes: 0
		} as never;

		try {
			await saveToLibrary(fetch, animeId, 'watching', 0);
		} catch (error) {
			toast.error('Failed to add anime to library', {
				action: {
					label: 'Retry',
					onClick: addToLibrary
				}
			});
			metadataState.library = null;
		}

		await invalidate((url) => url.pathname.startsWith(`/anime/${animeId}`));
	};

	const removeFromLibrary = async () => {
		if (!animeId) return;

		let oldLibrary = metadataState.library;

		// Optimistic update
		if (metadataState.library) {
			metadataState.library = null;
			open = false;
		}

		try {
			await deleteFromLibrary(fetch, animeId);
		} catch (err) {
			toast.error('Failed to remove anime from library', {
				action: {
					label: 'Retry',
					onClick: removeFromLibrary
				}
			});
			metadataState.library = oldLibrary;
		}

		await invalidate((url) => url.pathname.startsWith(`/anime/${animeId}`));
	};

	const form = superForm(updateLibrarySchema.assert({ status: 'watching', watchedEpisodes: 0 }), {
		SPA: true,
		validators: arktypeClient(updateLibrarySchema),
		onUpdate: async ({ form, cancel }) => {
			if (!form.valid) return;
			if (!animeId) return;

			let oldLibrary = metadataState.library;
			// Optimistic update
			const { status, watchedEpisodes } = form.data;
			if (status === undefined || watchedEpisodes === undefined) return;
			if (metadataState.library) {
				metadataState.library.status = status;
				metadataState.library.watchedEpisodes = watchedEpisodes;
				open = false;
			}

			try {
				await saveToLibrary(fetch, animeId, status, watchedEpisodes);
			} catch (error) {
				toast.error('Failed to update anime in library', {
					action: {
						label: 'Retry',
						onClick: addToLibrary
					}
				});
				metadataState.library = oldLibrary;
				cancel();
			}

			await invalidate((url) => url.pathname.startsWith(`/anime/${animeId}`));
		}
	});

	const { form: formData, enhance, submitting } = form;

	$effect(() => {
		if (library) {
			formData.set({ watchedEpisodes: library.watchedEpisodes, status: library.status });
		}
	});
</script>

{#if library}
	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants()}>
			<Pencil />
			Update Library
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Title>Update Library</Dialog.Title>
			<form use:enhance class="flex flex-col justify-center gap-2">
				<Form.Field {form} name="status">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Status</Form.Label>
							<Select.Root type="single" bind:value={$formData.status} name={props.name}>
								<Select.Trigger {...props} class="capitalize">
									{$formData.status || 'Select a status'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="planning">Planning</Select.Item>
									<Select.Item value="watching">Watching</Select.Item>
									<Select.Item value="completed">Completed</Select.Item>
									<Select.Item value="dropped">Dropped</Select.Item>
									<Select.Item value="paused">Paused</Select.Item>
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="watchedEpisodes">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Watched Episodes</Form.Label>
							<Input
								{...props}
								bind:value={$formData.watchedEpisodes}
								type="number"
								placeholder="Enter the number of episodes you've watched"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Dialog.Footer>
					<Button variant="secondary" type="button" class="mr-auto" onclick={removeFromLibrary}>
						Remove from Library
					</Button>
					<Dialog.Close class={buttonVariants({ variant: 'secondary' })} type="button">
						Cancel
					</Dialog.Close>
					<Form.Button disabled={$submitting}>
						{#if $submitting}
							<Loader2 class="animate-spin" />
						{:else}
							Update
						{/if}
					</Form.Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Button onclick={addToLibrary}>
		<Bookmark />
		Add to Library
	</Button>
{/if}
