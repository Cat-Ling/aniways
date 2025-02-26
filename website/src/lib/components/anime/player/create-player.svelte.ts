import { goto } from '$app/navigation';
import type { streamInfo } from '$lib/api/anime/types';
import { appState } from '$lib/context/state.svelte';
import { convertComponentToHTML } from '$lib/utils';
import { ArkErrors, type } from 'arktype';
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';
import type Hls from 'hls.js';
import { Captions, LoaderCircle, Pause, SkipForward } from 'lucide-svelte';
import { amplifyVolumePlugin, skipPlugin, thumbnailPlugin, windowKeyBindPlugin } from './plugins';

type Props = {
  id: string;
  container: HTMLDivElement;
  source: typeof streamInfo.infer;
  nextEpisodeUrl: string | undefined;
  updateLibrary: () => void;
};

const artplayerSettingsSchema = type({
  times: 'Record<string, number>'
});

export const createArtPlayer = async ({
  id,
  container,
  source,
  nextEpisodeUrl,
  updateLibrary
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
    theme: 'hsl(var(--primary))',
    fullscreen: true,
    mutex: true,
    playbackRate: true,
    autoPlayback: true,
    autoOrientation: true,
    playsInline: false,
    pip: !!/(chrome|edg|safari|opr)/i.exec(navigator.userAgent),
    airplay: true,
    miniProgressBar: true,
    icons: {
      loading: convertComponentToHTML(LoaderCircle, {
        size: 100,
        class: 'animate-spin text-primary',
        style: 'fill: none !important;'
      })
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
          control: true,
          title: 'Quality',
          auto: 'Auto'
        }
      }),
      thumbnailPlugin(thumbnails!),
      skipPlugin(source),
      windowKeyBindPlugin(),
      amplifyVolumePlugin()
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
        icon: convertComponentToHTML(SkipForward, { size: 22 }),
        html: 'Auto Play Next Episode',
        switch: appState.settings.autoNextEpisode,
        onSwitch: () => {
          appState.settings.autoNextEpisode = !appState.settings.autoNextEpisode;
          return appState.settings.autoNextEpisode;
        }
      },
      {
        icon: convertComponentToHTML(Pause, { size: 22 }),
        html: 'Auto Resume Episode',
        switch: appState.settings.autoResumeEpisode,
        onSwitch: () => {
          appState.settings.autoResumeEpisode = !appState.settings.autoResumeEpisode;
          return appState.settings.autoResumeEpisode;
        }
      }
    ]
  });

  art.setting.add({
    icon: convertComponentToHTML(Captions, { size: 22, style: 'fill: none !important;' }),
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
  });

  art.on('ready', () => {
    if (appState.settings.autoResumeEpisode) {
      const time = artplayerSettingsSchema(
        JSON.parse(localStorage.getItem('artplayer_settings') ?? '{}')
      );
      if (time instanceof ArkErrors === false && time.times[id]) {
        if (time.times[id] >= art.duration) return;
        art.currentTime = time.times[id];
      }
    }

    if (appState.settings.autoPlayEpisode) {
      art.play();
    }
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

    updateLibrary();
  });

  return art;
};
