import type Artplayer from "artplayer";
import type { RefObject } from "react";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import artplayerPluginThumbnail from "artplayer-plugin-thumbnail";
import Hls from "hls.js";

import type { RouterOutputs } from "@aniways/trpc";
import { toast } from "@aniways/ui/sonner";

import "./artplayer.css";

import {
  ANIWAYS_LOGO,
  DOWNLOAD_ICON,
  LOADING_SVG,
  STREAMING_SOURCE_ICON,
} from "../../icons";

const getStreamingUrl = (
  streamingSources: RouterOutputs["episodes"]["getStreamingSources"],
  artPlayerRef: RefObject<Artplayer>
) => {
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

interface BaseArtPlayerConfigParameters {
  streamingSources: RouterOutputs["episodes"]["getStreamingSources"];
  artPlayerRef: RefObject<Artplayer>;
  playerContainer: HTMLDivElement;
  hls: RefObject<Hls>;
  downloadUrl: string;
}

export const getArtPlayerConfig = ({
  streamingSources,
  artPlayerRef,
  playerContainer,
  hls,
  downloadUrl,
}: BaseArtPlayerConfigParameters) => {
  return {
    id: streamingSources.sources[0]?.url,
    url: getStreamingUrl(streamingSources, artPlayerRef),
    container: playerContainer,
    mutex: true,
    hotkey: false,
    screenshot: window.innerWidth > 768, // Disable screenshot on mobile
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
    autoMini: false,
    pip: !!/(chrome|edg|safari|opr)/i.exec(navigator.userAgent),
    controls: [
      {
        name: "Download",
        html: `
          <a href="${downloadUrl}">
            ${DOWNLOAD_ICON}
          </a>
        `,
        tooltip: "Download",
        position: "right",
        index: 0,
      },
    ],
    plugins: [
      artplayerPluginHlsQuality({
        control: false,
        setting: true,
        auto: "Auto",
        getResolution: (level: { height?: string }) => {
          return !level.height || level.height !== "unknown" ?
              level.height + "P"
            : "Auto";
        },
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
          hls.current?.loadSource(url);
          hls.current?.attachMedia(video);
          return;
        }

        const canPlay = video.canPlayType("application/vnd.apple.mpegurl");
        if (canPlay === "probably" || canPlay === "maybe") {
          video.src = url;
          return;
        }

        toast.error("Your browser does not support HLS", {
          description: "Please use a modern browser",
        });
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
    ],
  } satisfies ConstructorParameters<typeof Artplayer>[0];
};
