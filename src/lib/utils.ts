import { load } from "cheerio";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function loadHtmlFromUrl(url: string, options?: RequestInit) {
  return fetch(url, options)
    .then((res) => res.text())
    .then(load);
}
