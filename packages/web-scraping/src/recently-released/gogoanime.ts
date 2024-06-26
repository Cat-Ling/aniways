/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parse } from "node-html-parser";

const BASE_URL = "https://gogoanime3.co";

export default async function getRecentlyReleasedAnimeFromGogo(
  page: number,
  abortSignal: AbortSignal
) {
  // each page is 20 anime
  const response = await fetch(`${BASE_URL}?page=${page}`, {
    signal: abortSignal,
  }).then(res => res.text());

  const recentlyReleased = parse(response)
    .querySelectorAll(".last_episodes li")
    .map(li => {
      const image = li.querySelector(".img img")!.getAttribute("src")!;

      const name = li.querySelector(".name")!.innerText.trim();

      const episode = Number(
        li.querySelector(".episode")!.innerText.trim().split("Episode ")[1]
      );

      const slug = li
        .querySelector("a")!
        .getAttribute("href")!
        .split("/")
        .pop()!
        .split("-episode-")[0]!;

      const url = `/anime/${slug}/episodes/${episode}`;

      return {
        name,
        image,
        episode,
        url,
      };
    });

  return recentlyReleased;
}
