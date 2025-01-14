import { scrapeHtml } from "@/lib/utils";
import { z } from "zod";
import { hiAnimeUrls } from "../constants";
import { extractAnimes } from "../utils";

export const SearchFilterItems = {
  type: [
    {
      label: "Movie",
      value: "1",
    },
    {
      label: "TV",
      value: "2",
    },
    {
      label: "OVA",
      value: "3",
    },
    {
      label: "ONA",
      value: "4",
    },
    {
      label: "Special",
      value: "5",
    },
    {
      label: "Music",
      value: "6",
    },
  ] as const,
  status: [
    {
      label: "Finished Airing",
      value: "1",
    },
    {
      label: "Currently Airing",
      value: "2",
    },
  ] as const,
  rated: [
    {
      label: "G",
      value: "1",
    },
    {
      label: "PG",
      value: "2",
    },
    {
      label: "PG 13",
      value: "3",
    },
    {
      label: "R",
      value: "4",
    },
    {
      label: "R+",
      value: "5",
    },
    {
      label: "Rx",
      value: "6",
    },
  ] as const,
  score: [
    {
      label: "(1) Appalling",
      value: "1",
    },
    {
      label: "(2) Horrible",
      value: "2",
    },
    {
      label: "(3) Very Bad",
      value: "3",
    },
    {
      label: "(4) Bad",
      value: "4",
    },
    {
      label: "(5) Average",
      value: "5",
    },
    {
      label: "(6) Fine",
      value: "6",
    },
    {
      label: "(7) Good",
      value: "7",
    },
    {
      label: "(8) Very Good",
      value: "8",
    },
    {
      label: "(9) Great",
      value: "9",
    },
    {
      label: "(10) Masterpiece",
      value: "10",
    },
  ] as const,
  season: [
    {
      label: "Spring",
      value: "1",
    },
    {
      label: "Summer",
      value: "2",
    },
    {
      label: "Fall",
      value: "3",
    },
    {
      label: "Winter",
      value: "4",
    },
  ] as const,
  sort: [
    {
      label: "Default",
      value: "default",
    },
    {
      label: "Recently Added",
      value: "recently_added",
    },
    {
      label: "Recently Updated",
      value: "recently_updated",
    },
    {
      label: "Score",
      value: "score",
    },
    {
      label: "Name A-Z",
      value: "name_az",
    },
    {
      label: "Released Date",
      value: "released_date",
    },
    {
      label: "Most Watched",
      value: "most_watched",
    },
  ] as const,
  genres: [
    {
      label: "Action",
      value: "1",
    },
    {
      label: "Adventure",
      value: "2",
    },
    {
      label: "Cars",
      value: "3",
    },
    {
      label: "Comedy",
      value: "4",
    },
    {
      label: "Dementia",
      value: "5",
    },
    {
      label: "Demons",
      value: "6",
    },
    {
      label: "Drama",
      value: "8",
    },
    {
      label: "Ecchi",
      value: "9",
    },
    {
      label: "Fantasy",
      value: "10",
    },
    {
      label: "Game",
      value: "11",
    },
    {
      label: "Harem",
      value: "35",
    },
    {
      label: "Historical",
      value: "13",
    },
    {
      label: "Horror",
      value: "14",
    },
    {
      label: "Isekai",
      value: "44",
    },
    {
      label: "Josei",
      value: "43",
    },
    {
      label: "Kids",
      value: "15",
    },
    {
      label: "Magic",
      value: "16",
    },
    {
      label: "Martial Arts",
      value: "17",
    },
    {
      label: "Mecha",
      value: "18",
    },
    {
      label: "Military",
      value: "38",
    },
    {
      label: "Music",
      value: "19",
    },
    {
      label: "Mystery",
      value: "7",
    },
    {
      label: "Parody",
      value: "20",
    },
    {
      label: "Police",
      value: "39",
    },
    {
      label: "Psychological",
      value: "40",
    },
    {
      label: "Romance",
      value: "22",
    },
    {
      label: "Samurai",
      value: "21",
    },
    {
      label: "School",
      value: "23",
    },
    {
      label: "Sci-Fi",
      value: "24",
    },
    {
      label: "Seinen",
      value: "42",
    },
    {
      label: "Shoujo",
      value: "25",
    },
    {
      label: "Shoujo Ai",
      value: "26",
    },
    {
      label: "Shounen",
      value: "27",
    },
    {
      label: "Shounen Ai",
      value: "28",
    },
    {
      label: "Slice of Life",
      value: "36",
    },
    {
      label: "Space",
      value: "29",
    },
    {
      label: "Sports",
      value: "30",
    },
    {
      label: "Super Power",
      value: "31",
    },
    {
      label: "Supernatural",
      value: "37",
    },
    {
      label: "Thriller",
      value: "41",
    },
    {
      label: "Vampire",
      value: "32",
    },
  ] as const,
};

export type SearchFilters = {
  type?: (typeof SearchFilterItems)["type"][number]["value"];
  status?: (typeof SearchFilterItems)["status"][number]["value"];
  rated?: (typeof SearchFilterItems)["rated"][number]["value"];
  score?: (typeof SearchFilterItems)["score"][number]["value"];
  season?: (typeof SearchFilterItems)["season"][number]["value"];
  sort?: (typeof SearchFilterItems)["sort"][number]["value"];
  genres?: (typeof SearchFilterItems)["genres"][number]["value"][];
};

export const SearchFilterSchema = z.object({
  type: z.enum(["1", "2", "3", "4", "5", "6"]).optional(),
  status: z.enum(["1", "2"]).optional(),
  rated: z.enum(["1", "2", "3", "4", "5", "6"]).optional(),
  score: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]).optional(),
  season: z.enum(["1", "2", "3", "4"]).optional(),
  sort: z
    .enum([
      "default",
      "recently_added",
      "recently_updated",
      "score",
      "name_az",
      "released_date",
      "most_watched",
    ])
    .optional(),
  genres: z
    .enum([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "8",
      "9",
      "10",
      "11",
      "35",
      "13",
      "14",
      "44",
      "43",
      "15",
      "16",
      "17",
      "18",
      "38",
      "19",
      "7",
      "20",
      "39",
      "40",
      "22",
      "21",
      "23",
      "24",
      "42",
      "25",
      "26",
      "27",
      "28",
      "36",
      "29",
      "30",
      "31",
      "37",
      "41",
      "32",
    ])
    .array()
    .optional(),
});

export const searchAnime = async (
  query: string,
  page = 1,
  searchFilters?: SearchFilters,
) => {
  const searchParams = new URLSearchParams({
    keyword: query,
    page: page.toString(),
  });

  if (searchFilters) {
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (!value) return;
      if (typeof value === "string") {
        searchParams.set(key, value);
        return;
      }
      searchParams.set(key, value.join(","));
    });
  }

  const animes = await scrapeHtml({
    url: hiAnimeUrls.search,
    searchParams: searchParams,
    extract: extractAnimes,
  });

  return {
    ...animes,
    currentPage: page,
  };
};
