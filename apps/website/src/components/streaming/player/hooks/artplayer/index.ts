import { useEffect, useRef } from "react";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { useRouter } from "next/navigation";
import Artplayer from "artplayer";

import type { Settings } from "@aniways/db/schema";
import type { RouterOutputs } from "@aniways/trpc";
import { toast } from "@aniways/ui/sonner";

import { api } from "~/trpc/react";
import { useHLS } from "../hls";
import { getArtPlayerConfig } from "./config";

export interface UseArtPlayerProps {
  streamingSources: RouterOutputs["episodes"]["getStreamingSources"];
  nextEpisodeUrl: string | null;
  episode: number;
  malId: number | null;
}

type ListStatus = Exclude<
  RouterOutputs["myAnimeList"]["getAnimeMetadata"],
  undefined
>["listStatus"];

export const useVideoPlayer = ({
  streamingSources,
  nextEpisodeUrl,
  episode,
  malId,
}: UseArtPlayerProps) => {
  const toastRef = useRef<string | number | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const artPlayerRef = useRef<Artplayer | null>(null);

  const hls = useHLS();
  const router = useRouter();

  const settingsRef = useRef<Settings | null>(null);
  const settings = api.settings.getSettings.useQuery();

  const listStatusRef = useRef<ListStatus | null>(null);
  const listStatus = api.myAnimeList.getListStatusOfAnime.useQuery(
    { malId: malId ?? 0 },
    { enabled: !!malId }
  );

  const utils = api.useUtils();

  const { mutate: updateAnimeInMyList } =
    api.myAnimeList.updateAnimeInMyList.useMutation({
      onSuccess: async () => {
        await utils.anime.continueWatching.invalidate();
        await utils.myAnimeList.getAnimeMetadata.invalidate();
        if (toastRef.current) {
          toast.dismiss(toastRef.current);
        }
        toast.success("List updated", {
          description: "Your list has been updated",
        });
      },
    });

  useEffect(() => {
    listStatusRef.current = listStatus.data;
    settingsRef.current = settings.data ?? null;
  }, [listStatus, settings]);

  useEffect(() => {
    if (!settings.data?.autoNext || !nextEpisodeUrl) return;
    router.prefetch(nextEpisodeUrl, {
      kind: PrefetchKind.FULL,
    });
  }, [settings.data, router, nextEpisodeUrl]);

  useEffect(() => {
    const playerContainer = playerContainerRef.current;
    if (!playerContainer) return;

    const config = getArtPlayerConfig({
      streamingSources,
      artPlayerRef,
      playerContainer,
      hls,
      downloadUrl: `${episode}/download`,
    });

    artPlayerRef.current = new Artplayer(config);

    const artPlayer = artPlayerRef.current;

    artPlayer.on("ready", () => {
      const artPlayer = artPlayerRef.current;
      if (!artPlayer) return;

      const settings = settingsRef.current;
      const autoPlay =
        settings?.autoPlay ?? localStorage.getItem("autoPlay") === "true";

      if (!autoPlay) return;

      void artPlayer.play();
    });

    artPlayer.on("video:play", () => {
      const artPlayer = artPlayerRef.current;
      if (!artPlayer) return;
      if (artPlayer.layers.show === false) return;
      artPlayer.layers.show = false;
    });

    artPlayer.on("play", () => {
      const artPlayer = artPlayerRef.current;
      if (!artPlayer) return;
      artPlayer.layers.show = false;
    });

    artPlayer.on("pause", () => {
      const artPlayer = artPlayerRef.current;
      if (!artPlayer) return;
      artPlayer.layers.show = true;
    });

    artPlayer.on("video:ended", () => {
      const artPlayer = artPlayerRef.current;
      if (!artPlayer) return;

      const settings = settingsRef.current;
      const autoUpdateMal = settings?.autoUpdateMal ?? false;
      const listStatus = listStatusRef.current;

      if (
        autoUpdateMal &&
        malId &&
        listStatus &&
        listStatus.status === "watching" &&
        listStatus.num_episodes_watched < episode
      ) {
        toastRef.current = toast.loading("Updating list", {
          description: "Updating your list...",
        });

        updateAnimeInMyList({
          malId,
          numWatchedEpisodes: episode,
          score: listStatus.score,
          status: "watching",
        });
      }

      const autoNext =
        settings?.autoNext ?? localStorage.getItem("autoNext") === "true";

      if (!autoNext || !nextEpisodeUrl) return;

      router.push(nextEpisodeUrl, { scroll: false });
    });

    return () => {
      artPlayerRef.current?.destroy();
      artPlayerRef.current = null;
    };
  }, [
    episode,
    hls,
    malId,
    nextEpisodeUrl,
    router,
    streamingSources,
    updateAnimeInMyList,
  ]);

  return { playerContainerRef, artPlayerRef };
};
