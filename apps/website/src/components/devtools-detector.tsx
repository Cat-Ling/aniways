"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import devtoolsDetector from "devtools-detector";

import { env } from "~/env";

const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

export const DevToolsDetector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useMounted();

  useEffect(() => {
    if (env.NODE_ENV === "development") return;
    if (!isMounted) return;

    const listener = (isOpen: boolean) => {
      if (env.NODE_ENV === "development") return;
      if (pathname === "/devtools") {
        if (!isOpen) router.replace("/");
        return;
      }
      if (!isOpen) return;
      router.replace(`/devtools?redirect=${pathname}`);
    };

    devtoolsDetector.addListener(listener);
    devtoolsDetector.setDetectDelay(500);
    devtoolsDetector.launch();

    return () => {
      devtoolsDetector.stop();
      devtoolsDetector.removeListener(listener);
    };
  }, [router, pathname, isMounted]);

  return <div></div>;
};
