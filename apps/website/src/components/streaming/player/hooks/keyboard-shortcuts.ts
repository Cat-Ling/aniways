import type Artplayer from "artplayer";
import type { RefObject } from "react";
import { useEffect } from "react";

export const useKeyboardShortcuts = (
  artPlayerRef: RefObject<Artplayer | null>
) => {
  useEffect(() => {
    const keyboardEventListener = (event: KeyboardEvent) => {
      const artPlayer = artPlayerRef.current;
      if (!artPlayer) return;

      const { key, currentTarget } = event;

      if (currentTarget instanceof HTMLInputElement) return;

      switch (key) {
        // Play/Pause
        case " ":
          event.preventDefault();
          artPlayer.toggle();
          break;

        // Fullscreen
        case "f":
          event.preventDefault();
          artPlayer.fullscreen = !artPlayer.fullscreen;
          break;

        // Seek forward
        case "ArrowRight":
          event.preventDefault();
          artPlayer.currentTime += 5;
          break;

        // Seek backward
        case "ArrowLeft":
          event.preventDefault();
          artPlayer.currentTime -= 5;
          break;

        // Volume up
        case "ArrowUp":
          event.preventDefault();
          artPlayer.volume += 0.1;
          break;

        // Volume down
        case "ArrowDown":
          event.preventDefault();
          artPlayer.volume -= 0.1;
          break;

        // Mute
        case "m":
          event.preventDefault();
          artPlayer.muted = !artPlayer.muted;
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", keyboardEventListener);

    return () => {
      document.removeEventListener("keydown", keyboardEventListener);
    };
  }, [artPlayerRef]);
};
