import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Artplayer from "artplayer";

import type { RouterOutputs } from "@aniways/api";
import { toast } from "@aniways/ui/sonner";

import { api } from "~/trpc/react";
import { useHLS } from "../hls";
import { getArtPlayerConfig } from "./config";

export interface UseArtPlayerProps {
  streamingSources: RouterOutputs["episodes"]["getStreamingSources"];
  episodeSlug: string;
  nextEpisodeUrl: string | null;
  episode: number;
  malId: number | null;
}

export const useVideoPlayer = ({
  streamingSources,
  episodeSlug,
  nextEpisodeUrl,
  episode,
  malId,
}: UseArtPlayerProps) => {
  const toastRef = useRef<string | number | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const artPlayerRef = useRef<Artplayer | null>(null);

  const hls = useHLS();
  const router = useRouter();

  const settings = api.settings.getSettings.useQuery();
  const listStatus = api.myAnimeList.getAnimeMetadata.useQuery(
    { malId: malId ?? 0 },
    { enabled: !!malId, select: data => data?.listStatus }
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
    const playerContainer = playerContainerRef.current;
    if (!playerContainer) return;

    if (settings.isLoading) return;

    const config = getArtPlayerConfig({
      episodeSlug,
      streamingSources,
      artPlayerRef,
      playerContainer,
      hls,
      settings: settings.data ?? null,
    });

    artPlayerRef.current = new Artplayer(config);

    const artPlayer = artPlayerRef.current;

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

      const autoUpdateMal = settings.data?.autoUpdateMal ?? false;

      if (
        autoUpdateMal &&
        malId &&
        listStatus.data?.status === "watching" &&
        listStatus.data.num_episodes_watched < episode
      ) {
        toastRef.current = toast.loading("Updating list", {
          description: "Updating your list...",
        });
        updateAnimeInMyList({
          malId,
          numWatchedEpisodes: episode,
          score: listStatus.data.score,
          status: "watching",
        });
      }

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
    episode,
    episodeSlug,
    hls,
    listStatus.data?.num_episodes_watched,
    listStatus.data?.score,
    listStatus.data?.status,
    malId,
    nextEpisodeUrl,
    router,
    settings.data,
    settings.isLoading,
    streamingSources,
    updateAnimeInMyList,
  ]);

  return { playerContainerRef, artPlayerRef };
};
