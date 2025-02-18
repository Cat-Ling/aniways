import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import lucidePreprocess from 'vite-plugin-lucide-preprocess';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		visualizer({
			emitFile: true,
			filename: 'stats.html'
		}),
		lucidePreprocess(),
		{
			name: 'vite-plugin-patch-ssr-noexternal',
			enforce: 'post',
			config(cfg) {
				if (!cfg.ssr?.noExternal) return;
				cfg.ssr.noExternal = cfg.ssr.noExternal.map((x) =>
					typeof x !== 'string' || x.includes('*') || x.endsWith('/**')
						? x
						: `${x}${!x.endsWith('/') ? '/' : ''}**`
				);
			}
		}
	]
});
