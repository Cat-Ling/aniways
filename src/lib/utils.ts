import { type CheerioAPI, load } from "cheerio";
import { clsx, type ClassValue } from "clsx";
import { revalidateTag, unstable_cache } from "next/cache";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ScrapeHtmlOptions<T> = RequestInit & {
  url: string;
  searchParams?: string | URLSearchParams;
  prepareHtml?: (html: string) => string;
  extract?: ($: CheerioAPI) => T;
};

export function scrapeHtml<T = CheerioAPI>(options: ScrapeHtmlOptions<T>) {
  const url = new URL(options.url);

  if (options.searchParams) {
    url.search = new URLSearchParams(options.searchParams).toString();
  }

  const transform = options.prepareHtml ?? ((html) => html);
  const after = options.extract ?? ((api) => api as T);

  return fetch(url, options)
    .then((res) => res.text())
    .then(transform)
    .then(load)
    .then(after);
}

export async function getCached<T>(
  key: string,
  fn: () => Promise<T>,
  expires = 1000 * 60 * 60 * 24, // 1 day
) {
  return unstable_cache(fn, key.split("-"), {
    tags: key.split("-"),
    revalidate: expires,
  })();
}

export async function revalidateCache(key: string) {
  return revalidateTag(key);
}
