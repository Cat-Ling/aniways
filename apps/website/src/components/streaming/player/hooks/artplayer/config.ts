import type Artplayer from "artplayer";
import type { RefObject } from "react";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import artplayerPluginThumbnail from "artplayer-plugin-thumbnail";

import type { RouterOutputs } from "@aniways/api";

import { ANIWAYS_LOGO, LOADING_SVG } from "../../icons";

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
  episodeSlug: string;
  streamingSources: RouterOutputs["episodes"]["getStreamingSources"];
  artPlayerRef: RefObject<Artplayer>;
  playerContainer: HTMLDivElement;
}

export const getBaseArtPlayerConfig = ({
  episodeSlug,
  streamingSources,
  artPlayerRef,
  playerContainer,
}: BaseArtPlayerConfigParameters) => {
  return {
    id: episodeSlug,
    url: getStreamingUrl(streamingSources, artPlayerRef),
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
  } satisfies ConstructorParameters<typeof Artplayer>[0];
};
