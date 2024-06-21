import parse from "node-html-parser";

const URLS = [
  "https://anitaku.to/category",
  "https://gogoanime3.co/category",
] as const;

export default async function scrapeDetailsOfAnime(slug: string) {
  const scrapeDetails = async (
    url: (typeof URLS)[number],
  ): ReturnType<typeof getDetails> => {
    try {
      const abortController = new AbortController();

      const timeout = setTimeout(() => {
        abortController.abort(new Error("Timeout " + url + " " + slug));
      }, 5000);

      const details = await getDetails(url, slug, abortController.signal);

      clearTimeout(timeout);

      if (!details) {
        throw new Error("Details not found " + url + " " + slug);
      }

      return details;
    } catch (e) {
      console.error(e);

      const nextUrl = URLS.at(URLS.indexOf(url) + 1);
      if (nextUrl) {
        return scrapeDetails(nextUrl);
      }

      return null;
    }
  };

  return await scrapeDetails(URLS[0]);
}

async function getDetails(url: string, slug: string, signal: AbortSignal) {
  const html = await fetch(`${url}/${slug}`, { signal }).then((res) =>
    res.text(),
  );

  const dom = parse(html);

  const title = dom.querySelector(".anime_info_body_bg h1")?.innerText.trim();

  if (title === undefined) return null;

  const image = dom
    .querySelector(".anime_info_body_bg img")
    ?.getAttribute("src");

  if (image === undefined) return null;

  return {
    title,
    image,
  };
}
