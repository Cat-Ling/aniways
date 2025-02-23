<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { updateUser, uploadImage } from '$lib/api/auth';
	import { updateUserFormSchema } from '$lib/api/auth/types';
	import Miku from '$lib/assets/miku.png';
	import ChangePassword from '$lib/components/auth/change-password.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { format } from 'date-fns';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { arktypeClient } from 'sveltekit-superforms/adapters';
	import type { PageProps } from './$types';
	import { appState } from '$lib/context/state.svelte';
	import { Button } from '$lib/components/ui/button';

	let { data }: PageProps = $props();

	let createdAt = $derived.by(() => {
		const timeMillis = data.user?.createdAt;
		if (!timeMillis) return '';
		return format(new Date(timeMillis), 'do MMMM yyyy');
	});

	let updatedAt = $derived.by(() => {
		const timeMillis = data.user?.updatedAt;
		if (!timeMillis) return '';
		return format(new Date(timeMillis), 'do MMMM yyyy');
	});

	const onSettingChange = (key: keyof (typeof appState)['settings']) => {
		return (checked: boolean) => {
			if (!data.settings) return;
			appState.settings[key] = checked;
		};
	};

	const submit = async (
		data: typeof updateUserFormSchema.infer,
		messages: {
			success: string;
			error: string;
		},
		onError?: (err: unknown) => void
	) => {
		try {
			await updateUser(fetch, data);
			await invalidate(({ pathname }) => pathname.startsWith('/users') || pathname === '/auth/me');
			toast.success(messages.success);
		} catch (err) {
			toast.error(messages.error);
			console.error(err);
		}
	};

	const form = superForm(
		{
			email: data.user?.email ?? '',
			username: data.user?.username ?? '',
			profilePicture: data.user?.profilePicture ?? null
		},
		{
			SPA: true,
			validators: arktypeClient(updateUserFormSchema),
			resetForm: false,
			onUpdate: async ({ form, cancel }) => {
				if (!form.valid) return;

				await submit(
					form.data,
					{ success: 'Profile updated', error: 'Failed to update profile' },
					cancel
				);
			}
		}
	);

	const { form: formdata, enhance, submitting } = form;

	$effect(() => {
		formdata.set({
			email: data.user?.email ?? '',
			username: data.user?.username ?? '',
			profilePicture: data.user?.profilePicture ?? null
		});
	});
</script>

<div class="m-3 mt-20 flex flex-col-reverse gap-2 md:m-8 md:mt-20 md:flex-row">
	<div class="h-full md:sticky md:top-20">
		<form use:enhance class="max-w-md rounded-lg border bg-card p-4" enctype="multipart/form-data">
			<h1 class="mb-5 font-sora text-2xl font-bold">Profile</h1>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} bind:value={$formdata.email} placeholder="Enter your email" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="username">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Username</Form.Label>
						<Input {...props} bind:value={$formdata.username} placeholder="Enter your username" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<p class="text-sm text-muted-foreground">
				Member since {createdAt}
			</p>

			<p class="text-sm text-muted-foreground">
				Last updated on {updatedAt}
			</p>

			<Form.Button disabled={$submitting} class="mt-4 w-full">
				{#if $submitting}
					<Loader2 class="animate-spin" />
				{:else}
					Save
				{/if}
			</Form.Button>
		</form>

		<div class="mt-4 max-w-md rounded-lg bg-card p-4">
			<h2 class="font-sora text-xl font-bold">Profile Picture</h2>
			<p class="mb-8 text-sm text-muted-foreground">Click on the image to change it</p>
			<Form.Field {form} name="profilePicture">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>
							<div
								class="group relative mx-auto size-72 cursor-pointer overflow-hidden rounded-full border bg-background"
							>
								<img
									src={$formdata.profilePicture ?? Miku}
									class="z-0 h-full w-full object-cover object-center"
									alt={`Profile picture of ${data.user?.username}`}
								/>
								<div
									class="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 transition group-hover:opacity-100"
								>
									Change
								</div>
							</div>
						</Form.Label>
						<!-- The input which will store file url -->
						<Input bind:value={$formdata.profilePicture} class="hidden" />
						<!-- File input -->
						<Input
							{...props}
							type="file"
							class="hidden"
							accept="image/*"
							onchange={async (e) => {
								if (!data.user) return;
								let id = toast.loading('Uploading image');
								try {
									const input = e.target as HTMLInputElement;
									const formFile = input.files?.[0];
									if (!formFile) return;
									const result = await uploadImage(fetch, formFile);
									if (!result || !result.url) {
										toast.error('Failed to upload image');
										return;
									}
									await submit(
										{ ...data.user, profilePicture: result.url },
										{ success: 'Image uploaded', error: 'Failed to upload image' }
									);
								} finally {
									toast.dismiss(id);
								}
							}}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>
	<div class="mt-4 flex h-fit w-full flex-col gap-4 md:mt-0 md:px-4">
		<h2 class="font-sora text-2xl font-bold">Settings</h2>
		<div class="rounded-lg bg-card p-4">
			<h3 class="font-sora text-xl font-bold">General</h3>
			<p class="text-sm text-muted-foreground">Manage your account settings</p>

			<div class="mt-4 flex items-center gap-2">
				<Switch
					id="auto-resume"
					checked={data.settings?.autoResumeEpisode}
					onCheckedChange={onSettingChange('autoResumeEpisode')}
				/>
				<Label for="auto-resume">Auto Resume</Label>
			</div>
			<p class="mb-1 text-muted-foreground">
				Automatically resume from where you left off in the same device
			</p>

			<div class="mt-4 flex items-center gap-2">
				<Switch
					id="auto-play"
					checked={data.settings?.autoPlayEpisode}
					onCheckedChange={onSettingChange('autoPlayEpisode')}
				/>
				<Label for="auto-play">Auto Play</Label>
			</div>
			<p class="my-1 text-muted-foreground">Automatically play the next episode</p>

			<div class="mt-4 flex items-center gap-2">
				<Switch
					id="auto-next"
					checked={data.settings?.autoNextEpisode}
					onCheckedChange={onSettingChange('autoNextEpisode')}
				/>
				<Label for="auto-next">Auto Next</Label>
			</div>
			<p class="my-1 text-muted-foreground">Automatically play the next episode</p>
		</div>
		<div class="rounded-lg bg-card p-4">
			<h3 class="font-sora text-xl font-bold">Tracking</h3>
			<p class="text-sm text-muted-foreground">Add external tracking services to your account</p>
			<div class="mt-4">
				<p class="text-sm text-muted-foreground">Coming soon</p>
			</div>
		</div>
		<div class="rounded-lg bg-card p-4">
			<h3 class="font-sora text-xl font-bold">Security</h3>
			<p class="text-sm text-muted-foreground">Change your password and other security settings</p>

			<div class="mt-4 flex items-center gap-2">
				<Switch
					id="incognito"
					checked={data.settings?.autoNextEpisode}
					onCheckedChange={onSettingChange('incognitoMode')}
				/>
				<Label for="incognito">Incognito Mode</Label>
			</div>
			<p class="my-1 text-muted-foreground">Will not save to library or history when enabled</p>

			<ChangePassword />
		</div>
		<div class="rounded-lg bg-card p-4">
			<h3 class="font-sora text-xl font-bold">Delete Account</h3>
			<p class="text-sm text-muted-foreground">Delete your account and all associated data</p>
			<Button variant="destructive" type="button" class="mt-4 w-full max-w-md"
				>Delete Account</Button
			>
		</div>
	</div>
</div>
