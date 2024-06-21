/* eslint-disable @typescript-eslint/no-non-null-assertion */
import parse from "node-html-parser";

const BASE_URL = "https://anitaku.to/home.html";

export default async function getRecentlyReleasedAnimeFromAnitaku(
  page: number,
  abortSignal: AbortSignal,
) {
  // total of 20 anime per page
  const response = await fetch(`${BASE_URL}?page=${page}`, {
    signal: abortSignal,
  }).then((res) => res.text());

  const recentlyReleased = parse(response)
    .querySelectorAll(".last_episodes li")
    .map((li) => {
      const image = li.querySelector(".img img")!.getAttribute("src")!;

      const name = li.querySelector(".name")!.innerText.trim();

      const episode = Number(
        li.querySelector(".episode")!.innerText.trim().split("Episode ")[1],
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
