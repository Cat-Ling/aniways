/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parse } from "node-html-parser";

const urls = [
  {
    type: "anitaku",
    baseUrl: "https://anitaku.pe",
    recentlyReleasedUrl: "https://anitaku.pe/home.html",
  },
  {
    type: "gogoanime",
    baseUrl: "https://gogoanime3.co",
    recentlyReleasedUrl: "https://gogoanime3.co",
  },
] as const;

type FetchType = (typeof urls)[number]["type"];

export default async function getRecentlyReleasedAnime(
  page: number,
  type: FetchType = "anitaku",
  errorCount = 0
) {
  const { signal } = new AbortController();

  const { recentlyReleasedUrl, baseUrl } = urls.find(url => url.type === type)!;

  try {
    const hasNext = fetch(`${recentlyReleasedUrl}?page=${page + 1}`, {
      signal,
    })
      .then(res => res.text())
      .then(parse)
      .then(dom => dom.querySelectorAll(".last_episodes li").length > 0);

    const recentlyReleasedPage = await fetch(
      `${recentlyReleasedUrl}?page=${page}`,
      { signal }
    )
      .then(res => res.text())
      .then(parse);

    const recentlyReleased = await Promise.all(
      recentlyReleasedPage
        .querySelectorAll(".last_episodes li")
        .map(async li => {
          const name = li.querySelector(".name > a")!.getAttribute("title")!;

          const image = li.querySelector(".img img")!.getAttribute("src")!;

          const episode = Number(
            li
              .querySelector(".episode")!
              .innerText.trim()
              .replace("Episode ", "")
          );

          const episodeSlug = li
            .querySelector(".name > a")!
            .getAttribute("href")!
            .trim()
            .replace("/", "");

          const animeSlug = await fetch(`${baseUrl}/${episodeSlug}`, { signal })
            .then(res => res.text())
            .then(parse)
            .then(dom => {
              return dom
                .querySelector(".anime-info > a")!
                .getAttribute("href")!
                .replace("/category/", "");
            });

          return {
            name,
            image,
            episode,
            episodeSlug,
            animeSlug,
          };
        })
    );

    return {
      anime: recentlyReleased,
      hasNext: await hasNext,
    };
  } catch (e) {
    console.error(e);

    if (errorCount > 3) {
      throw new Error("Failed to fetch data");
    }

    return getRecentlyReleasedAnime(
      page,
      type === "anitaku" ? "gogoanime" : "anitaku",
      errorCount + 1
    );
  }
}
