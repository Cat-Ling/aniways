"use client";

import { type RouterOutputs } from "@/trpc/react";
import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import { ANIWAYS_LOGO, LOADING_SVG, SUBTITLE_ICON } from "./icons";
import artplayerPluginVttThumbnail from "artplayer-plugin-vtt-thumbnail";

import "./artplayer.css";

type PlayerProps = {
  sources: RouterOutputs["hiAnime"]["getEpisodeSources"];
};

export const Player = ({ sources }: PlayerProps) => {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!artRef.current) return;

    const sourceUrl = sources.sources[0]?.url;
    const thumbnails = sources.tracks?.find(
      (track) => track.kind === "thumbnails",
    );

    const defaultSubtitle = sources.tracks?.find(
      (track) => track.kind === "captions" && track.default,
    );

    if (!sourceUrl) return;

    const art = new Artplayer({
      container: artRef.current,
      url: sourceUrl,
      setting: true,
      theme: "hsl(346.8 77.2% 49.8%)",
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
        loading: LOADING_SVG,
      },
      subtitle: {
        url: defaultSubtitle?.file,
        type: "vtt",
        encoding: "utf-8",
        escape: false,
        style: {
          fontSize: "1.8rem",
        },
      },
      plugins: [
        artplayerPluginHlsControl({
          quality: {
            setting: true,
            getName: (level: { height: number }) => `${level.height}p`,
            title: "Quality",
            auto: "Auto",
          },
        }),
        artplayerPluginVttThumbnail({
          vtt: thumbnails?.file,
        }),
      ],
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
      settings: [
        {
          icon: SUBTITLE_ICON,
          html: "Captions",
          tooltip: defaultSubtitle?.label,
          selector: sources.tracks
            .filter((track) => track.kind === "captions")
            .map((track) => ({
              default: track.default,
              html: track.label,
              url: track.file,
            })),
          onSelect: (item) => {
            const url = item.url as unknown;
            if (!url || typeof url !== "string") return;
            art.subtitle.url = url;
            return item.html;
          },
        },
      ],
      customType: {
        m3u8: (video, url, art) => {
          if (Hls.isSupported()) {
            if (art.hls) (art.hls as Hls).destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on("destroy", () => hls.destroy());
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Unsupported playback format: m3u8";
          }
        },
      },
    });

    art.on("fullscreen", (isFullScreen) => {
      const screenWidth = window.screen.width;
      const videoWidth = artRef.current?.clientWidth ?? 0;
      const fontSize = isFullScreen
        ? `${(screenWidth / videoWidth) * 1.8}rem`
        : "1.8rem";
      art.subtitle.style("fontSize", fontSize);
    });

    return () => {
      art.destroy();
    };
  }, [sources]);

  return <div ref={artRef} className="aspect-video w-full" />;
};
