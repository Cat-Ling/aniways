import { parse } from "node-html-parser";

const BASE_URL = "https://anitaku.to";

export default async function scrapeAnimeSlugFromAnitaku(
	episodeSlug: string,
	signal: AbortSignal,
) {
	const html = await fetch(`${BASE_URL}/${episodeSlug}`, { signal }).then(
		(res) => res.text(),
	);
	const dom = parse(html);
	return dom
		.querySelector(".anime-info a")
		?.getAttribute("href")
		?.split("/")
		.pop();
}
