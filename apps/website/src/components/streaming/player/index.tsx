"use client";

import { useEffect, useState } from "react";

import { Button } from "@aniways/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@aniways/ui/dialog";

import type { UseArtPlayerProps } from "./hooks/artplayer";
import { useVideoPlayer } from "./hooks/artplayer";
import { useDefaultLocalSettings } from "./hooks/default-player-settings";
import { useKeyboardShortcuts } from "./hooks/keyboard-shortcuts";

type VideoPlayerClientProps = UseArtPlayerProps;

type Source = "Aniways Stream" | "VidStreaming" | "StreamWish";

const AniwaysStream = (props: VideoPlayerClientProps) => {
  const { playerContainerRef, artPlayerRef } = useVideoPlayer(props);

  useKeyboardShortcuts(artPlayerRef);
  useDefaultLocalSettings();
  return <div ref={playerContainerRef} className="aspect-video w-full" />;
};

const IframeStream = (
  props: VideoPlayerClientProps & {
    type: "VidStreaming" | "StreamWish";
  }
) => {
  return (
    <iframe
      src={
        props.streamingSources.iframe[
          props.type === "VidStreaming" ? "default" : "backup"
        ]
      }
      className="aspect-video w-full border-0"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      frameBorder="0"
    />
  );
};

export const VideoPlayerClient = (props: VideoPlayerClientProps) => {
  const [source, setSource] = useState<Source>("Aniways Stream");

  useEffect(() => {
    localStorage.setItem("source", source);
  }, [source]);

  useEffect(() => {
    const storedSource = localStorage.getItem("source");
    if (
      storedSource === "Aniways Stream" ||
      storedSource === "StreamWish" ||
      storedSource === "VidStreaming"
    )
      setSource(storedSource);
  }, []);

  return (
    <>
      {source === "Aniways Stream" ?
        <AniwaysStream {...props} />
      : <IframeStream {...props} type={source} />}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"secondary"} className="mt-3">
            Change Source
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Source</DialogTitle>
            <DialogDescription>
              Select the source you want to use to watch this episode. Note that
              only the Aniways Stream supports auto-play, auto-update and auto
              next features.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex flex-col gap-2 md:flex-row">
            {["Aniways Stream", "VidStreaming", "StreamWish"].map(s => (
              <DialogClose asChild key={s}>
                <Button
                  onClick={() => setSource(s as Source)}
                  variant={source === s ? "default" : "secondary"}
                >
                  {s}
                </Button>
              </DialogClose>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
