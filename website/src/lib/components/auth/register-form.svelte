<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { StatusError } from '$lib/api';
	import { login, register } from '$lib/api/auth';
	import { registerFormSchema } from '$lib/api/auth/types';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { setError, superForm } from 'sveltekit-superforms';
	import { arktypeClient } from 'sveltekit-superforms/adapters';

	const defaultValues = {
		email: '',
		username: '',
		password: '',
		confirmPassword: '',
		profilePicture: null
	} as typeof registerFormSchema.infer;

	const form = superForm(defaultValues, {
		SPA: true,
		validators: arktypeClient(registerFormSchema),
		onUpdate: async ({ form, cancel }) => {
			if (!form.valid) return;
			try {
				await register(fetch, form.data);
				await login(fetch, form.data);
				await invalidateAll();
			} catch (err) {
				if (err instanceof StatusError && err.status === 400) {
					const error = await err.response.text();
					if (error.includes('email')) {
						setError(form, 'email', 'Email is already taken');
					} else if (error.includes('username')) {
						setError(form, 'username', 'Username is already taken');
					} else {
						toast.error('An error occurred. Please try again later.');
					}
				} else {
					toast.error('An error occurred. Please try again later.');
				}
				cancel();
			}
		}
	});

	const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance class="flex flex-col justify-center gap-2">
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} placeholder="Enter your email" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Username</Form.Label>
				<Input {...props} bind:value={$formData.username} placeholder="Enter your username" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input
					{...props}
					bind:value={$formData.password}
					type="password"
					placeholder="Enter your password"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="confirmPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm Password</Form.Label>
				<Input
					{...props}
					bind:value={$formData.confirmPassword}
					type="password"
					placeholder="Confirm your password"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button disabled={$submitting} class={buttonVariants({ class: 'mt-3' })}>
		{#if $submitting}
			<Loader2 class="animate-spin" />
		{:else}
			Create Account
		{/if}
	</Form.Button>
</form>
