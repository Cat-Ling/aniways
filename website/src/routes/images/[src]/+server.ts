import { error } from '@sveltejs/kit';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, params, url }) => {
	const src = params.src;
	const quality = url.searchParams.get('q') || '75';
	const w = url.searchParams.get('w');
	const h = url.searchParams.get('h');

	if (!src) {
		error(400, { message: 'Missing required parameters' });
	}

	try {
		const response = await fetch(src);
		if (!response.ok) error(404, { message: 'Image not found' });

		const imageReq = sharp(await response.arrayBuffer());

		const optimized =
			w && h
				? imageReq
						.resize(parseInt(w), parseInt(h))
						.webp({ quality: parseInt(quality) })
						.toBuffer()
				: imageReq.webp({ quality: parseInt(quality) }).toBuffer();

		return new Response(await optimized, {
			headers: {
				'Content-Type': 'image/webp',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		error(500, { message });
	}
};
