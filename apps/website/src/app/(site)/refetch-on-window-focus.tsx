"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const RefetchOnWindowFocus = () => {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => router.refresh();

    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
    };
  }, [router]);

  return <></>;
};
