"use client";

interface Options {
  redirectUrl?: string;
}

export const signIn = (opts?: Options) => {
  const url = new URL("/api/myanimelist/auth/sign-in", window.location.href);

  if (opts?.redirectUrl) {
    url.searchParams.set("redirectUrl", opts.redirectUrl);
  }

  window.location.href = url.href;
};

export const signOut = (opts?: Options) => {
  const url = new URL("/api/myanimelist/auth/sign-out", window.location.href);

  if (opts?.redirectUrl) {
    url.searchParams.set("redirectUrl", opts.redirectUrl);
  }

  window.location.href = url.href;
};
