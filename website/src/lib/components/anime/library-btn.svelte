<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { deleteFromLibrary, saveToLibrary } from '$lib/api/library';
	import { updateLibrarySchema, type libraryItemSchema } from '$lib/api/library/types';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Bookmark, Loader2, Pencil, Trash } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { arktypeClient } from 'sveltekit-superforms/adapters';

	type Props = {
		animeId: string;
		library: typeof libraryItemSchema.infer | null;
		mode?: 'icon' | 'button';
	};

	let { animeId, library, mode = 'button' }: Props = $props();

	let open = $state(false);
	let isAddToLibraryLoading = $state(false);
	let isRemoveFromLibraryLoading = $state(false);

	const addToLibrary = async () => {
		isAddToLibraryLoading = true;
		try {
			await saveToLibrary(fetch, animeId, 'watching', 0);
			await invalidate((url) => url.pathname.startsWith(`/library`));
			toast.success('Anime added to library');
			open = false;
		} catch (error) {
			toast.error('Failed to add anime to library', {
				action: {
					label: 'Retry',
					onClick: addToLibrary
				}
			});
		}
		isAddToLibraryLoading = false;
	};

	const removeFromLibrary = async () => {
		isRemoveFromLibraryLoading = true;
		try {
			await deleteFromLibrary(fetch, animeId);
			await invalidate((url) => url.pathname.startsWith(`/library`));
			toast.success('Anime removed from library');
			open = false;
		} catch (err) {
			toast.error('Failed to remove anime from library', {
				action: {
					label: 'Retry',
					onClick: removeFromLibrary
				}
			});
		}
		isRemoveFromLibraryLoading = false;
	};

	const form = superForm(updateLibrarySchema.assert({ status: 'watching', watchedEpisodes: 0 }), {
		SPA: true,
		validators: arktypeClient(updateLibrarySchema),
		resetForm: false,
		onUpdate: async ({ form, cancel }) => {
			if (!form.valid) return;

			const { status, watchedEpisodes } = form.data;
			if (status === undefined || watchedEpisodes === undefined) return;

			try {
				await saveToLibrary(fetch, animeId, status, watchedEpisodes);
				await invalidate((url) => url.pathname.startsWith(`/library`));
				toast.success('Anime updated in library');
				open = false;
			} catch (error) {
				toast.error('Failed to update anime in library', {
					action: {
						label: 'Retry',
						onClick: addToLibrary
					}
				});
				cancel();
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	$effect(() => {
		if (!library) return;
		form.reset({
			data: {
				status: library.status,
				watchedEpisodes: library.watchedEpisodes
			}
		});
	});
</script>

{#if library}
	<Dialog.Root bind:open>
		<Dialog.Trigger
			class={buttonVariants()}
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				open = true;
			}}
		>
			<Pencil />
			{mode === 'icon' ? null : 'Update Library'}
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
					<Button
						variant="destructive"
						type="button"
						class="mr-auto"
						onclick={removeFromLibrary}
						disabled={$submitting || isRemoveFromLibraryLoading}
					>
						{#if isRemoveFromLibraryLoading}
							<Loader2 class="animate-spin" />
						{:else}
							Remove from Library
						{/if}
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
	<Button onclick={addToLibrary} disabled={isAddToLibraryLoading}>
		{#if isAddToLibraryLoading}
			<Loader2 class="animate-spin" />
		{:else}
			<Bookmark />
			Add to Library
		{/if}
	</Button>
{/if}
