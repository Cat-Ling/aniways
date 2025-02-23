<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { buttonVariants } from '../ui/button';
	import { arktypeClient } from 'sveltekit-superforms/adapters';
	import { updatePasswordFormSchema } from '$lib/api/auth/types';
	import { toast } from 'svelte-sonner';
	import { updateUserPassword } from '$lib/api/auth';
	import { Loader2 } from 'lucide-svelte';
	import Input from '../ui/input/input.svelte';
	import { StatusError } from '$lib/api';

	let open = $state(false);

	const form = superForm(
		{
			oldPassword: '',
			newPassword: '',
			confirmPassword: ''
		},
		{
			SPA: true,
			validators: arktypeClient(updatePasswordFormSchema),
			onUpdate: async ({ form, cancel }) => {
				if (!form.valid) return;
				try {
					await updateUserPassword(fetch, form.data);
					toast.success('Password updated successfully.');
					open = false;
				} catch (err) {
					if (err instanceof StatusError && err.status === 401) {
						toast.error('Old password is incorrect.');
					} else {
						toast.error('An error occurred. Please try again later.');
					}
					console.error(err);
					cancel();
				}
			}
		}
	);

	const { form: formdata, enhance, submitting } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'outline', class: 'mb-2 mt-4 w-full' })}
		type="button"
	>
		Change Password
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Title>Change Password</Dialog.Title>
		<form use:enhance>
			<Form.Field {form} name="oldPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Old Password</Form.Label>
						<Input type="password" bind:value={$formdata.oldPassword} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="newPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>New Password</Form.Label>
						<Input type="password" bind:value={$formdata.newPassword} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="confirmPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirm Password</Form.Label>
						<Input type="password" bind:value={$formdata.confirmPassword} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'secondary' })} type="button">
					Cancel
				</Dialog.Close>
				<Form.Button disabled={$submitting}>
					{#if $submitting}
						<Loader2 class="animate-spin" />
					{:else}
						Change Password
					{/if}
				</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
