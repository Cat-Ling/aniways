import parse from "node-html-parser";

import { BASE_URL } from "../utils/constants";

export const getRecentlyReleasedAnime = async (page = 1) => {
  const document = await fetch(`${BASE_URL}/tv?page=${page}`)
    .then(res => res.text())
    .then(parse);

  const anime = document.querySelectorAll(".flw-item").map(el => {
    const poster =
      el.querySelector(".film-poster img")?.getAttribute("data-src") ?? "";
    const url = el.querySelector(".film-poster a")?.getAttribute("href") ?? "";
    const id = url.split("-").pop() ?? "";

    const anchor = el.querySelector(".film-detail .film-name a");
    const title = anchor?.text ?? "";
    const japaneseTitle = anchor?.getAttribute("data-jname") ?? "";

    const type = el.querySelector(".film-detail .fd-infor .fdi-item")?.text;
    const duration = el.querySelector(
      ".film-detail .fd-infor .fdi-duration"
    )?.text;

    return {
      id,
      title,
      japaneseTitle,
      poster,
      url,
      metadata: {
        type,
        duration,
      },
    };
  });

  return anime;
};
