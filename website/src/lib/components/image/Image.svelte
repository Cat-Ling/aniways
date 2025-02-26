<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLImgAttributes } from 'svelte/elements';

	type Props = HTMLImgAttributes & {
		quality?: number;
		priority?: boolean;
		width?: number;
		height?: number;
		src: string;
	};

	let { src, quality, priority, ...props }: Props = $props();

	let width = $state(props.width || 0);
	let height = $state(props.height || 0);
	let url = $derived.by(() => {
		const searchParams = new URLSearchParams();
		if (quality) searchParams.set('q', quality.toString());
		if (width) searchParams.set('w', width.toString());
		if (height) searchParams.set('h', height.toString());
		return `/images/${encodeURIComponent(src)}?${searchParams.toString()}`;
	});

	let img: HTMLImageElement | undefined = $state();

	onMount(() => {
		if (priority) {
			if (!img) return;
			img.src = url;
		}

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (!img) return;
					img.src = url;
					observer.disconnect();
				}
			});
		});

		if (img) observer.observe(img);

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	{#if priority}
		<link rel="preload" as="image" href={url} />
	{/if}
</svelte:head>

<img
	{...props}
	bind:this={img}
	data-src={src}
	loading={priority ? 'eager' : 'lazy'}
	onload={(e) => {
		const img = e.target as HTMLImageElement;
		if (!img) return;
		if (width && height && width < img.naturalWidth && height < img.naturalHeight) return;
		width = img.naturalWidth;
		height = img.naturalHeight;
	}}
/>
