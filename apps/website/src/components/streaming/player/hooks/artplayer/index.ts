import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Artplayer from "artplayer";
import Hls from "hls.js";

import type { RouterOutputs } from "@aniways/api";

import { api } from "~/trpc/react";
import {
  AUTO_NEXT_ICON,
  AUTO_PLAY_ICON,
  STREAMING_SOURCE_ICON,
} from "../../icons";
import { useHLS } from "../hls";
import { getBaseArtPlayerConfig } from "./config";

export interface UseArtPlayerProps {
  streamingSources: RouterOutputs["episodes"]["getStreamingSources"];
  episodeSlug: string;
  nextEpisodeUrl: string | null;
}

export const useVideoPlayer = ({
  streamingSources,
  episodeSlug,
  nextEpisodeUrl,
}: UseArtPlayerProps) => {
  const time = useRef<number>(0);
  const router = useRouter();
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const artPlayerRef = useRef<Artplayer | null>(null);

  const hls = useHLS();

  const settings = api.settings.getSettings.useQuery();
  const utils = api.useUtils();
  const { mutate: updateSettings } = api.settings.updateSettings.useMutation({
    onSuccess: async () => {
      await utils.settings.getSettings.invalidate();
    },
  });

  useEffect(() => {
    const playerContainer = playerContainerRef.current;
    if (!playerContainer) return;

    if (settings.isLoading) return;

    const config = getBaseArtPlayerConfig({
      episodeSlug,
      streamingSources,
      artPlayerRef,
      playerContainer,
    });

    artPlayerRef.current = new Artplayer({
      ...config,
      autoplay:
        settings.data?.autoPlay ?? localStorage.getItem("autoPlay") === "true",
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
          switch:
            settings.data?.autoPlay ??
            localStorage.getItem("autoPlay") === "true",
          onSwitch: item => {
            const nextState = !item.switch;
            localStorage.setItem("autoPlay", String(nextState));
            if (settings.data) {
              updateSettings({
                ...settings.data,
                autoPlay: nextState,
              });
            }
            return nextState;
          },
        },
        {
          html: "Auto next",
          icon: AUTO_NEXT_ICON,
          switch:
            settings.data?.autoNext ??
            localStorage.getItem("autoNext") === "true",
          onSwitch: item => {
            const nextState = !item.switch;
            localStorage.setItem("autoNext", String(nextState));
            if (settings.data) {
              updateSettings({
                ...settings.data,
                autoNext: nextState,
              });
            }
            return nextState;
          },
        },
      ],
    });

    artPlayerRef.current.on("ready", () => {
      if (!artPlayerRef.current) return;
      if (time.current) {
        artPlayerRef.current.video.currentTime = time.current;
        void artPlayerRef.current.video.play();
      }
    });

    artPlayerRef.current.on("video:timeupdate", () => {
      if (!artPlayerRef.current) return;
      time.current = artPlayerRef.current.video.currentTime;
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
      const autoNext =
        settings.data?.autoNext ?? localStorage.getItem("autoNext") === "true";
      if (!autoNext || !nextEpisodeUrl) return;
      router.push(nextEpisodeUrl, { scroll: false });
    });

    return () => {
      artPlayerRef.current?.destroy();
      artPlayerRef.current = null;
    };
  }, [
    streamingSources,
    episodeSlug,
    nextEpisodeUrl,
    router,
    hls,
    settings,
    updateSettings,
  ]);

  return { playerContainerRef, artPlayerRef };
};
