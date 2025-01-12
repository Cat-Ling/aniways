"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/404");
  }, [router]);

  return null;
};

export default ErrorPage;
