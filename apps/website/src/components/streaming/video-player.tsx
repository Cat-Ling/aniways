"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Artplayer from "artplayer";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import Hls from "hls.js";

import type { RouterOutputs } from "@aniways/api";

interface VideoPlayerProps {
  streamingSources: RouterOutputs["episodes"]["getStreamingSources"];
  episodeSlug: string;
  nextEpisodeUrl: string | null;
}

declare global {
  interface Window {
    hls: Hls;
  }
}

export const VideoPlayer = ({
  streamingSources,
  episodeSlug,
  nextEpisodeUrl,
}: VideoPlayerProps) => {
  const router = useRouter();
  const artRef = useRef<HTMLDivElement | null>(null);
  const artPlayer = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (localStorage.getItem("autoNext") === null) {
      localStorage.setItem("autoNext", "true");
    }
    if (localStorage.getItem("autoPlay") === null) {
      localStorage.setItem("autoPlay", "true");
    }
    if (localStorage.getItem("streamSource") === null) {
      localStorage.setItem("streamSource", "Main");
    }
  }, []);

  useEffect(() => {
    const video = artRef.current;
    if (!video) return;

    window.hls = new Hls();
    artPlayer.current = new Artplayer({
      id: episodeSlug,
      url:
        streamingSources.sources.find(source => source.quality === "default")
          ?.url ??
        streamingSources.sources.find(source => source.quality === "backup")
          ?.url ??
        "",
      container: video,
      plugins: [
        artplayerPluginHlsQuality({
          control: false,
          setting: true,
          auto: "Auto",
        }),
      ],
      icons: {
        loading: `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
              <circle cx="50" cy="50" fill="none" stroke="#ff312d" stroke-width="5" r="32" stroke-dasharray="150.79644737231007 52.26548245743669">
                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
              </circle>
            </svg>`,
      },
      layers: [
        {
          name: "aniways_logo",
          html: `<img src="/logo.png" width="100px">`,
          style: {
            position: "absolute",
            top: "20px",
            right: "20px",
          },
        },
      ],
      screenshot: true,
      miniProgressBar: true,
      airplay: true,
      autoSize: true,
      setting: true,
      fullscreen: true,
      fullscreenWeb: true,
      playbackRate: true,
      fastForward: false,
      autoPlayback: true,
      autoOrientation: true,
      pip: /(chrome|edg|safari|opr)/i.exec(navigator.userAgent) ? true : false,
      playsInline: true,
      autoplay: true,
      autoMini: false,
      customType: {
        m3u8: function (video, url) {
          if (Hls.isSupported()) {
            window.hls.loadSource(url);
            window.hls.attachMedia(video);
          } else {
            const canPlay = video.canPlayType("application/vnd.apple.mpegurl");
            if (canPlay === "probably" || canPlay === "maybe") {
              video.src = url;
            } else {
              if (!artPlayer.current) return;
              artPlayer.current.notice.show =
                "Does not support playback of m3u8";
            }
          }
        },
      },
    });

    artPlayer.current.setting.add({
      html: "Stream Source",
      width: 200,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ffffff" d="M4 1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1m0 8h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m0 8h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M9 5h1V3H9v2m0 8h1v-2H9v2m0 8h1v-2H9v2M5 3v2h2V3H5m0 8v2h2v-2H5m0 8v2h2v-2H5Z"/></svg>',
      tooltip: localStorage.getItem("streamSource") ?? "Main",
      selector: [
        {
          default:
            localStorage.getItem("streamSource") === "Main" ? true : false,
          html: "Main",
          url: streamingSources.sources.find(
            source => source.quality === "default"
          )?.url,
        },
        {
          default:
            localStorage.getItem("streamSource") === "Backup" ? true : false,
          html: "Backup",
          url: streamingSources.sources.find(
            source => source.quality === "backup"
          )?.url,
        },
      ],
      onSelect: item => {
        if (item.url && typeof item.url === "string") {
          void artPlayer.current?.switchQuality(item.url);
        }
        localStorage.setItem("streamSource", item.html);
        return item.html;
      },
    });

    artPlayer.current.setting.add({
      html: "Auto play",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ffffff" d="M16 18h2V6h-2M6 18l8.5-6L6 6v12Z"/></svg>',
      switch: localStorage.getItem("autoPlay") === "true",
      onSwitch: function (item) {
        const nextState = !item.switch;
        localStorage.setItem("autoPlay", String(nextState));
        return nextState;
      },
    });

    artPlayer.current.setting.add({
      html: "Auto next",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ffffff" d="M6 18h2V6H6M18 6v12l-8.5-6L18 6Z"/></svg>',
      switch: localStorage.getItem("autoNext") === "true",
      onSwitch: function (item) {
        const nextState = !item.switch;
        localStorage.setItem("autoNext", String(nextState));
        return nextState;
      },
    });

    artPlayer.current.on("play", () => {
      if (!artPlayer.current) return;
      artPlayer.current.layers.show = false;
    });

    artPlayer.current.on("pause", () => {
      if (!artPlayer.current) return;
      artPlayer.current.layers.show = true;
    });

    artPlayer.current.on("video:ended", () => {
      const autoNext = localStorage.getItem("autoNext") === "true";
      if (!autoNext || !nextEpisodeUrl) return;
      router.push(nextEpisodeUrl);
    });

    return () => {
      artPlayer.current?.destroy();
      artPlayer.current = null;
    };
  }, [streamingSources.sources, episodeSlug, nextEpisodeUrl, router]);

  return <div ref={artRef} className="aspect-video w-full" />;
};
