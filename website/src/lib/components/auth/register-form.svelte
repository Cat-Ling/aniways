<script lang="ts">
	import { StatusError } from '$lib/api';
	import { login, register } from '$lib/api/auth';
	import { registerFormSchema } from '$lib/api/auth/types';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { arktypeClient } from 'sveltekit-superforms/adapters';

	const form = superForm(
		{ email: '', username: '', password: '', confirmPassword: '' },
		{
			SPA: true,
			validators: arktypeClient(registerFormSchema),
			onUpdate: async (props) => {
				if (!props.form.valid) return;
				try {
					await register(fetch, props.form.data);
					await login(fetch, props.form.data);
					window.location.reload();
				} catch (err) {
					if (err instanceof StatusError && err.status === 400) {
						// TODO: Set errors using api response
						form.errors.set({
							username: ['Username already exists or'],
							email: ['Email already exists or']
						});
						props.cancel();
					}
				}
			}
		}
	);

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
