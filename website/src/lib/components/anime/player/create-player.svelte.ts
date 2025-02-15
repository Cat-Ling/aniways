import { goto } from '$app/navigation';
import type { streamInfo } from '$lib/api/anime/types';
import { LOADING_SVG, SUBTITLE_ICON } from '$lib/assets/icons';
import { appState } from '$lib/context/state.svelte';
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';
import NextIcon from 'lucide-svelte/icons/skip-forward';
import type Hls from 'hls.js';
import { thumbnailPlugin } from './plugins';
import { mount } from 'svelte';

type Props = {
	id: string;
	container: HTMLDivElement;
	source: typeof streamInfo.infer;
	nextEpisodeUrl: string | undefined;
	setIsLoading: (loading: boolean) => void;
};

export const createArtPlayer = async ({
	id,
	container,
	source,
	nextEpisodeUrl,
	setIsLoading
}: Props) => {
	const thumbnails = source.tracks.find((track) => track.kind === 'thumbnails');
	const defaultSubtitle = source.tracks.find((track) => track.default && track.kind === 'captions');
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);

	const Hls = import('hls.js');
	const Artplayer = await import('artplayer').then((module) => module.default);

	const art = new Artplayer({
		id,
		container,
		url: source.sources[0].file,
		setting: true,
		theme: 'hsl(346.8 77.2% 49.8%)',
		screenshot: true,
		volume: 100,
		fullscreen: true,
		mutex: true,
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

	const elem = document.createElement('div');
	mount(NextIcon, { target: elem, props: { size: 22 } });

	art.setting.add({
		icon: art.icons.setting,
		html: 'Player Settings',
		selector: [
			{
				icon: art.icons.play,
				html: 'Auto Play Episode',
				switch: appState.settings.autoPlayEpisode,
				onSwitch: () => {
					appState.settings.autoPlayEpisode = !appState.settings.autoPlayEpisode;
					return appState.settings.autoPlayEpisode;
				}
			},
			{
				icon: elem.innerHTML,
				html: 'Auto Play Next Episode',
				switch: appState.settings.autoNextEpisode,
				onSwitch: () => {
					appState.settings.autoNextEpisode = !appState.settings.autoNextEpisode;
					return appState.settings.autoNextEpisode;
				}
			}
		]
	});

	art.on('ready', () => {
		art.hotkey.add('KeyF', () => {
			art.fullscreen = !art.fullscreen;
		});

		art.hotkey.add('KeyM', () => {
			art.muted = !art.muted;
		});

		if (appState.settings.autoPlayEpisode) {
			art.play();
		}
	});

	art.on('video:canplay', () => {
		setIsLoading(false);
	});

	art.on('fullscreen', (isFullScreen) => {
		const base = isMobile ? 1 : 1.8;
		const screenWidth = window.screen.width;
		const videoWidth = container.clientWidth ?? 0;
		const fontSize = isFullScreen ? `${(screenWidth / videoWidth) * base}rem` : `${base}rem`;
		art.subtitle.style('fontSize', fontSize);
	});

	art.on('video:ended', () => {
		if (nextEpisodeUrl && appState.settings.autoNextEpisode) {
			goto(nextEpisodeUrl);
		}
	});

	return art;
};
