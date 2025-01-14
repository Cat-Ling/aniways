"use client";

import { api, type RouterOutputs } from "@/trpc/react";
import Artplayer from "artplayer";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";
import Hls from "hls.js";
import { useEffect, useMemo, useRef } from "react";
import { ANIWAYS_LOGO, LOADING_SVG, SUBTITLE_ICON } from "./icons";

import { type Settings } from "@/server/db/schema";
import { type MyListStatus } from "@animelist/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { thumbnailPlugin } from "./thumbnail";

type PlayerProps = {
  sources: RouterOutputs["hiAnime"]["getEpisodeSources"];
  animeId: string;
  currentEpisode: number;
};

type DataRef = {
  settings: Omit<Settings, "darkMode">;
  listStatus: MyListStatus | undefined;
};

export const Player = ({ sources, animeId, currentEpisode }: PlayerProps) => {
  const router = useRouter();
  const artRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<string | number | null>(null);

  const dataRef = useRef<DataRef | null>(null);
  const settings = api.settings.getSettings.useQuery(undefined, {
    retry: false,
  });
  const listStatus = api.mal.getAnimeStatusInMAL.useQuery(
    { malId: sources.malID },
    { enabled: !!sources.malID },
  );

  const nextUrl = useMemo(() => {
    if (!sources.nextEpisode) return null;
    return `/anime/${animeId}?episode=${sources.nextEpisode}`;
  }, [sources.nextEpisode, animeId]);

  const utils = api.useUtils();
  const { mutate: updateEntryInMal } = api.mal.updateEntryInMal.useMutation({
    onSuccess: async () => {
      await utils.mal.getContinueWatching.invalidate();
      await utils.mal.getPlanToWatch.invalidate();
      await utils.mal.getAnimeInfo.invalidate();
      if (toastRef.current) toast.dismiss(toastRef.current);
      toast.success("List updated", {
        description: "Your list has been updated successfully",
      });
    },
  });

  useEffect(() => {
    if (settings.isLoading || listStatus.isLoading) return;

    dataRef.current = {
      settings: settings.data ?? {
        autoNext: true,
        autoPlay: true,
        autoUpdateMal: false,
      },
      listStatus: listStatus.data,
    };

    const autoNext = settings.data?.autoNext ?? true;
    if (!autoNext || !sources.nextEpisode) return;

    void utils.hiAnime.getEpisodeSources.prefetch({
      id: animeId,
      episode: sources.nextEpisode,
    });
  }, [settings, listStatus, sources.nextEpisode, animeId, utils]);

  useEffect(() => {
    if (!artRef.current) return;

    const sourceUrl = sources.sources[0]?.url;
    const thumbnails = sources.tracks?.find(
      (track) => track.kind === "thumbnails",
    );

    const defaultSubtitle = sources.tracks?.find(
      (track) => track.kind === "captions" && track.default,
    );

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
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
        url: defaultSubtitle?.file ?? "",
        type: "vtt",
        encoding: "utf-8",
        escape: false,
        style: {
          fontSize: isMobile ? "1rem" : "1.8rem",
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
        thumbnailPlugin(thumbnails!),
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
          selector: [
            {
              html: "Off",
              default: false,
              url: "",
              off: true,
            },
            ...sources.tracks
              .filter((track) => track.kind === "captions")
              .map((track) => ({
                default: track.default,
                html: track.label ?? "Unknown",
                url: track.file,
              })),
          ],
          onSelect: (item) => {
            const url = item.url as unknown;
            if (typeof url !== "string") return;
            art.subtitle.url = url;
            art.subtitle.show = !!url;
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
      const base = isMobile ? 1 : 1.8;
      const screenWidth = window.screen.width;
      const videoWidth = artRef.current?.clientWidth ?? 0;
      const fontSize = isFullScreen
        ? `${(screenWidth / videoWidth) * base}rem`
        : `${base}rem`;
      art.subtitle.style("fontSize", fontSize);
    });

    art.on("ready", () => {
      const settings = dataRef.current?.settings;
      const autoPlay = settings?.autoPlay ?? true;
      if (!autoPlay) return;
      void art.play();
    });

    art.on("video:play", () => {
      art.layers.show = false;
    });

    art.on("play", () => {
      art.layers.show = false;
    });

    art.on("pause", () => {
      art.layers.show = true;
    });

    art.on("video:pause", () => {
      art.layers.show = true;
    });

    art.on("video:ended", () => {
      art.layers.show = true;

      const autoUpdateMal = dataRef.current?.settings.autoUpdateMal ?? false;
      const autoNext = dataRef.current?.settings.autoNext ?? false;
      const listStatus = dataRef.current?.listStatus;

      const canUpdateList = autoUpdateMal && sources.malID && listStatus;

      if (
        canUpdateList &&
        (listStatus.status === "watching" ||
          listStatus.status === "plan_to_watch") &&
        listStatus.num_episodes_watched < currentEpisode
      ) {
        toastRef.current = toast.loading("Updating list", {
          description: "Updating your list...",
        });

        updateEntryInMal({
          malId: sources.malID,
          numWatchedEpisodes: currentEpisode,
          status: "watching",
          score: listStatus.score,
        });
      }

      if (!autoNext || !nextUrl) return;

      router.push(nextUrl);
    });

    return () => {
      art.destroy();
    };
  }, [sources, nextUrl, currentEpisode, updateEntryInMal, router]);

  return <div ref={artRef} className="aspect-video w-full" />;
};
