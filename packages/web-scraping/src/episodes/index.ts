/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parse } from "node-html-parser";

export const scrapeAllEpisodes = async (animeSlug: string) => {
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

  return { episodes, animeSlug };
};
