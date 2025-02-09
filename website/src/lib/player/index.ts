import type { streamInfo } from '$lib/api/anime/types';
import { LOADING_SVG, SUBTITLE_ICON } from '$lib/assets/icons';
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';
import { thumbnailPlugin } from './plugins';
import type Hls from 'hls.js';
import type Artplayer from 'artplayer';

type Props = {
	container: HTMLDivElement;
	source: typeof streamInfo.infer;
	onError: (art: Artplayer) => void;
};

export const createArtPlayer = async ({ container, source, onError }: Props) => {
	const thumbnails = source.tracks.find((track) => track.kind === 'thumbnails');
	const defaultSubtitle = source.tracks.find((track) => track.default && track.kind === 'captions');
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);

	const Hls = import('hls.js');
	const Artplayer = await import('artplayer').then((module) => module.default);

	const art = new Artplayer({
		container,
		url: source.sources[0].file,
		setting: true,
		theme: 'hsl(346.8 77.2% 49.8%)',
		screenshot: true,
		volume: 100,
		fullscreen: true,
		mutex: true,
		autoSize: true,
		playbackRate: true,
		autoPlayback: true,
		autoOrientation: true,
		playsInline: true,
		pip: !!/(chrome|edg|safari|opr)/i.exec(navigator.userAgent),
		airplay: true,
		icons: {
			loading: LOADING_SVG
		},
		subtitle: {
			url: defaultSubtitle?.file ?? '',
			type: 'vtt',
			encoding: 'utf-8',
			escape: false,
			style: {
				fontSize: isMobile ? '1rem' : '1.8rem'
			}
		},
		plugins: [
			artplayerPluginHlsControl({
				quality: {
					setting: true,
					getName: (level: { height: number }) => `${level.height}p`,
					title: 'Quality',
					auto: 'Auto'
				}
			}),
			thumbnailPlugin(thumbnails!)
		],
		settings: [
			{
				icon: SUBTITLE_ICON,
				html: 'Captions',
				tooltip: defaultSubtitle?.label,
				selector: [
					{
						html: 'Off',
						default: false,
						url: '',
						off: true
					},
					...source.tracks
						.filter((track) => track.kind === 'captions')
						.map((track) => ({
							default: track.default,
							html: track.label ?? 'Unknown',
							url: track.file
						}))
				],
				onSelect: (item) => {
					const url = item.url as unknown;
					if (typeof url !== 'string') return;
					art.subtitle.url = url;
					art.subtitle.show = !!url;
					return item.html;
				}
			}
		],
		customType: {
			m3u8: (video, url, art) => {
				Hls.then((module) => {
					const Hls = module.default;
					if (Hls.isSupported()) {
						if (art.hls) (art.hls as Hls).destroy();
						const hls = new Hls();
						hls.loadSource(url);
						hls.attachMedia(video);
						art.hls = hls;
						hls.on(module.Events.ERROR, (err, data) => {
							if (data.type === module.ErrorTypes.NETWORK_ERROR) {
								onError(art);
								return;
							}

							art.notice.show = `Error: ${data.type} - ${data.details}`;
						});
						art.on('destroy', () => hls.destroy());
					} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
						video.src = url;
					} else {
						art.notice.show = 'Unsupported playback format: m3u8';
					}
				});
			}
		}
	});

	return art;
};
