"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Artplayer from "artplayer";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import artplayerPluginThumbnail from "artplayer-plugin-thumbnail";
import Hls from "hls.js";

import type { RouterOutputs } from "@aniways/api";

interface VideoPlayerClientProps {
  streamingSources: RouterOutputs["episodes"]["getStreamingSources"];
  episodeSlug: string;
  nextEpisodeUrl: string | null;
}

declare global {
  interface Window {
    hls: Hls;
  }
}

const useKeyboardShortcuts = (artPlayerRef: RefObject<Artplayer | null>) => {
  useEffect(() => {
    const keyboardEventListener = (event: KeyboardEvent) => {
      const artPlayer = artPlayerRef.current;
      if (!artPlayer) return;

      const { key } = event;

      switch (key) {
        // Play/Pause
        case " ":
          event.preventDefault();
          artPlayer.toggle();
          break;

        // Fullscreen
        case "f":
          event.preventDefault();
          artPlayer.fullscreen = !artPlayer.fullscreen;
          break;

        // Seek forward
        case "ArrowRight":
          event.preventDefault();
          artPlayer.currentTime += 5;
          break;

        // Seek backward
        case "ArrowLeft":
          event.preventDefault();
          artPlayer.currentTime -= 5;
          break;

        // Volume up
        case "ArrowUp":
          event.preventDefault();
          artPlayer.volume += 0.1;
          break;

        // Volume down
        case "ArrowDown":
          event.preventDefault();
          artPlayer.volume -= 0.1;
          break;

        // Mute
        case "m":
          event.preventDefault();
          artPlayer.muted = !artPlayer.muted;
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", keyboardEventListener);

    return () => {
      document.removeEventListener("keydown", keyboardEventListener);
    };
  }, [artPlayerRef]);
};

const useDefaultPlayerSettings = () => {
  const setDefaultSettings = (key: string, defaultValue: string) => {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, defaultValue);
  };

  useEffect(() => {
    setDefaultSettings("autoNext", "true");
    setDefaultSettings("autoPlay", "true");
    setDefaultSettings("streamSource", "Main");
  }, []);
};

const LOADING_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <circle cx="50" cy="50" fill="none" stroke="#ff312d" stroke-width="5" r="32" stroke-dasharray="150.79644737231007 52.26548245743669">
      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
    </circle>
  </svg>
`;

const ANIWAYS_LOGO = `<img src="/logo.png" width="100px">`;

const STREAMING_SOURCE_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path fill="#ffffff" d="M4 1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1m0 8h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m0 8h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M9 5h1V3H9v2m0 8h1v-2H9v2m0 8h1v-2H9v2M5 3v2h2V3H5m0 8v2h2v-2H5m0 8v2h2v-2H5Z"/>
  </svg>
`;

const AUTO_PLAY_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path fill="#ffffff" d="M16 18h2V6h-2M6 18l8.5-6L6 6v12Z"/>
  </svg>
`;

const AUTO_NEXT_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
    <path fill="#ffffff" d="M6 18h2V6H6M18 6v12l-8.5-6L18 6Z"/>
  </svg>
`;

const useVideoPlayer = ({
  streamingSources,
  episodeSlug,
  nextEpisodeUrl,
}: VideoPlayerClientProps) => {
  const router = useRouter();
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const artPlayerRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    const playerContainer = playerContainerRef.current;
    if (!playerContainer) return;

    window.hls = new Hls();

    const getStreamingUrl = () => {
      const { sources } = streamingSources;

      if (sources.length === 0) {
        if (artPlayerRef.current) {
          artPlayerRef.current.notice.show = "No streaming sources available";
        }
        return "";
      }

      const streamSource = localStorage.getItem("streamSource") ?? "Main";

      if (streamSource === "Main") {
        return sources.find(source => source.quality === "default")?.url ?? "";
      }

      if (streamSource === "Backup") {
        return sources.find(source => source.quality === "backup")?.url ?? "";
      }

      return sources.find(source => source.quality === "default")?.url ?? "";
    };

    artPlayerRef.current = new Artplayer({
      id: episodeSlug,
      url: getStreamingUrl(),
      container: playerContainer,
      mutex: true,
      hotkey: false,
      screenshot: true,
      miniProgressBar: true,
      airplay: true,
      autoSize: true,
      setting: true,
      volume: 100,
      fullscreen: true,
      playbackRate: true,
      fastForward: false,
      autoPlayback: true,
      autoOrientation: true,
      playsInline: true,
      autoplay: true,
      autoMini: false,
      pip: !!/(chrome|edg|safari|opr)/i.exec(navigator.userAgent),
      plugins: [
        artplayerPluginHlsQuality({
          control: false,
          setting: true,
          auto: "Auto",
        }),
        artplayerPluginThumbnail({
          vtt: streamingSources.tracks?.[0]?.file,
        }),
      ],
      icons: {
        loading: LOADING_SVG,
      },
      layers: [
        {
          name: "aniways_logo",
          html: ANIWAYS_LOGO,
          style: {
            position: "absolute",
            top: "20px",
            right: "20px",
          },
        },
      ],
      customType: {
        m3u8: (video, url) => {
          if (Hls.isSupported()) {
            window.hls.loadSource(url);
            window.hls.attachMedia(video);
            return;
          }

          const canPlay = video.canPlayType("application/vnd.apple.mpegurl");
          if (canPlay === "probably" || canPlay === "maybe") {
            video.src = url;
            return;
          }

          if (!artPlayerRef.current) return;
          artPlayerRef.current.notice.show =
            "Does not support playback of m3u8";
        },
      },
      settings: [
        {
          html: "Stream Source",
          width: 200,
          icon: STREAMING_SOURCE_ICON,
          tooltip: localStorage.getItem("streamSource") ?? "Main",
          selector: ["Main", "Backup"].map(source => ({
            default: localStorage.getItem("streamSource") === source,
            html: source,
            url: streamingSources.sources.find(
              stramingSource => stramingSource.quality === source.toLowerCase()
            )?.url,
          })),
          onSelect: item => {
            if (item.url && typeof item.url === "string") {
              void artPlayerRef.current?.switchQuality(item.url);
            }

            localStorage.setItem("streamSource", item.html);

            return item.html;
          },
        },
        {
          html: "Auto play",
          icon: AUTO_PLAY_ICON,
          switch: localStorage.getItem("autoPlay") === "true",
          onSwitch: item => {
            const nextState = !item.switch;
            localStorage.setItem("autoPlay", String(nextState));
            return nextState;
          },
        },
        {
          html: "Auto next",
          icon: AUTO_NEXT_ICON,
          switch: localStorage.getItem("autoNext") === "true",
          onSwitch: item => {
            const nextState = !item.switch;
            localStorage.setItem("autoNext", String(nextState));
            return nextState;
          },
        },
      ],
    });

    artPlayerRef.current.on("video:play", () => {
      if (!artPlayerRef.current) return;
      if (artPlayerRef.current.layers.show === false) return;
      artPlayerRef.current.layers.show = false;
    });

    artPlayerRef.current.on("play", () => {
      if (!artPlayerRef.current) return;
      artPlayerRef.current.layers.show = false;
    });

    artPlayerRef.current.on("pause", () => {
      if (!artPlayerRef.current) return;
      artPlayerRef.current.layers.show = true;
    });

    artPlayerRef.current.on("video:ended", () => {
      const autoNext = localStorage.getItem("autoNext") === "true";
      if (!autoNext || !nextEpisodeUrl) return;
      router.push(nextEpisodeUrl, { scroll: false });
    });

    return () => {
      artPlayerRef.current?.destroy();
      artPlayerRef.current = null;
    };
  }, [streamingSources, episodeSlug, nextEpisodeUrl, router]);

  return { playerContainerRef, artPlayerRef };
};

export const VideoPlayerClient = (props: VideoPlayerClientProps) => {
  const { playerContainerRef, artPlayerRef } = useVideoPlayer(props);

  useKeyboardShortcuts(artPlayerRef);
  useDefaultPlayerSettings();

  return <div ref={playerContainerRef} className="aspect-video w-full" />;
};
