/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parse } from "node-html-parser";

export const scrapeAllEpisodesOfAnime = async (animeSlug: string) => {
  const detailsPage = await fetch(`https://anitaku.pe/category/${animeSlug}`)
    .then(res => res.text())
    .then(parse);

  const id = detailsPage
    .querySelector(".anime_info_episodes_next input#movie_id")!
    .getAttribute("value");
  const defaultEp = detailsPage
    .querySelector(".anime_info_episodes_next input#default_ep")!
    .getAttribute("value");
  const alias = detailsPage
    .querySelector(".anime_info_episodes_next input#alias_anime")!
    .getAttribute("value");

  const episodePages = detailsPage
    .querySelectorAll("#episode_page li")
    .map(li => {
      const epStart = li.querySelector("a")?.getAttribute("ep_start");
      const epEnd = li.querySelector("a")?.getAttribute("ep_end");
      return {
        epStart,
        epEnd,
      };
    });

  const episodesHtml = await fetch(
    `https://ajax.gogocdn.net/ajax/load-list-episode?ep_start=${episodePages[0]?.epStart}&ep_end=${episodePages.at(-1)?.epEnd}&id=${id}&default_ep=${defaultEp}&alias=${alias}`
  )
    .then(res => res.text())
    .then(parse);

  const episodes = episodesHtml
    .querySelectorAll("#episode_related li")
    .map(episode => {
      const episodeSlug = episode
        .querySelector("a")!
        .getAttribute("href")!
        .replace("/", "")
        .trim();

      const episodeNumber = Number(
        episode.querySelector("a .name")!.innerText.trim().replace("EP ", "")
      );

      return {
        episode: episodeNumber,
        episodeSlug,
      };
    });

  return episodes;
};

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

export interface RecentlyReleasedAnime {
  name: string;
  image: string;
  episode: number;
  episodeSlug: string;
  animeSlug: string;
}

export const scrapeRecentlyReleasedAnimeEpisodes = async (
  page: number,
  type: FetchType = "anitaku",
  errorCount = 0
): Promise<{
  anime: RecentlyReleasedAnime[];
  hasNext: boolean;
}> => {
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
          const name = li.querySelector(".name > a")!.innerText.trim();

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

    return scrapeRecentlyReleasedAnimeEpisodes(
      page,
      type === "anitaku" ? "gogoanime" : "anitaku",
      errorCount + 1
    );
  }
};
