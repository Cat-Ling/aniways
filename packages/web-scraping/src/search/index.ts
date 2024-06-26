import searchAnimeFromAnitaku from "./anitaku";
import searchAnimeFromGogo from "./gogoanime";

export default async function searchAnime(query: string, page: number) {
  const functions = [
    {
      fn: searchAnimeFromAnitaku,
      name: "Anitaku",
    },
    {
      fn: searchAnimeFromGogo,
      name: "GogoAnime",
    },
  ] as const;

  // fetch anime
  // if fails or takes more than 2 seconds, move to the next one
  const getAnime = async (
    query: string,
    page: number,
    name: (typeof functions)[number]["name"],
    index: number,
    fn: (typeof functions)[number]["fn"]
  ): Promise<{
    animes: Awaited<ReturnType<typeof searchAnimeFromAnitaku>>;
    hasNext: boolean;
  }> => {
    try {
      let done = false;
      setTimeout(() => {
        if (!done) throw new Error("Timeout");
      }, 10000);
      const anime = await fn(query, page);
      return {
        animes: anime,
        hasNext: await fn(query, page + 1).then(res => {
          done = true;
          console.log(`Fetched search ${name} anime`);
          return res.length > 0;
        }),
      };
    } catch (e) {
      console.error(`Failed to fetch ${name} anime`, e);
      const nextFn = functions.at(index + 1);
      if (nextFn) {
        return await getAnime(query, page, nextFn.name, index + 1, nextFn.fn);
      }
      return {
        animes: [],
        hasNext: false,
      };
    }
  };

  return await getAnime(query, page, functions[0].name, 0, functions[0].fn);
}
