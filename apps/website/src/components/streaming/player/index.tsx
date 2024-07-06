"use client";

import type { UseArtPlayerProps } from "./hooks/artplayer";
import { useVideoPlayer } from "./hooks/artplayer";
import { useDefaultLocalSettings } from "./hooks/default-player-settings";
import { useKeyboardShortcuts } from "./hooks/keyboard-shortcuts";

type VideoPlayerClientProps = UseArtPlayerProps;

export const VideoPlayerClient = (props: VideoPlayerClientProps) => {
  const { playerContainerRef, artPlayerRef } = useVideoPlayer(props);

  useKeyboardShortcuts(artPlayerRef);
  useDefaultLocalSettings();

  return <div ref={playerContainerRef} className="aspect-video w-full" />;
};
