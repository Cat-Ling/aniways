import { useEffect, useRef } from "react";
import Hls from "hls.js";

declare global {
  interface Window {
    hls?: Hls;
  }
}

export const useHLS = () => {
  const hls = useRef<Hls | null>(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      hls.current = new Hls();
      window.hls = hls.current;
    }

    return () => {
      if (hls.current) {
        hls.current.destroy();
        hls.current = null;
        delete window.hls;
      }
    };
  }, []);

  return hls;
};
