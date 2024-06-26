/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parse } from "node-html-parser";

const BASE_URL = "https://anitaku.to";

export default async function searchAnimeFromAnitaku(
  query: string,
  page: number
) {
  // total of 20 anime per page
  const response = await fetch(
    `${BASE_URL}/search.html?page=${page}&keyword=${encodeURIComponent(query)}`
  ).then(res => res.text());

  const searchResults = parse(response)
    .querySelectorAll(".last_episodes ul.items li")
    .map(async li => {
      const image = li.querySelector(".img img")!.getAttribute("src")!;

      const name = li.querySelector(".name")!.innerText.trim();

      const url = li.querySelector(".name a")!.getAttribute("href")!;

      const slug = url.split("/").pop()!;

      const details = await fetch(`${BASE_URL}/${url}`).then(res => res.text());

      const episodes = parse(details)
        .querySelectorAll("#episode_page a")
        .pop()
        ?.getAttribute("ep_end");

      return {
        name,
        image,
        url: `/anime/${slug}`,
        episodes: episodes ? parseInt(episodes) : 0,
      };
    });

  return await Promise.all(searchResults);
}
