import { parse } from "node-html-parser";

export const getDownloadUrl = async (episodeSlug: string) => {
  const dom = await fetch(`https://anitaku.to/${episodeSlug}`)
    .then(res => res.text())
    .then(parse);

  return dom
    .querySelector(
      "div#wrapper_bg div.anime_video_body div.anime_video_body_cate div.favorites_book ul li a"
    )
    ?.getAttribute("href");
};
