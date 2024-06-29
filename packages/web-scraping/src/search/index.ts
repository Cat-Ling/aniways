import { searchQuery } from "./search-query";

export const searchAniList = async (query: string, page: number) => {
  const response = (await fetch("https://graphql.anilist.co", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      query: searchQuery,
      variables: {
        search: query,
        page: page,
        size: 20,
        type: "ANIME",
      },
    }),
  }).then(res => res.json())) as {
    data: {
      Page: {
        pageInfo: {
          total: number;
          perPage: number;
          currentPage: number;
          lastPage: number;
          hasNextPage: boolean;
        };
        media: {
          id: number;
          idMal: number;
          status: string;
          title: {
            userPreferred: string;
            romaji: string;
            english: string;
            native: string;
          };
          bannerImage: string;
          coverImage: {
            extraLarge: string;
            large: string;
            medium: string;
            color: string;
          };
          episodes: number;
          genres: string[];
          tags: {
            id: number;
            name: string;
          }[];
          season: string;
          format: string;
          seasonYear: number;
          averageScore: number;
          nextAiringEpisode: {
            airingAt: number;
            timeUntilAiring: number;
            episode: number;
          };
        }[];
      };
    };
  };

  const syncedData = await Promise.all(
    response.data.Page.media.map(async anime => {
      try {
        const data = (await fetch(
          `https://raw.githubusercontent.com/bal-mackup/mal-backup/master/anilist/anime/${anime.id}.json`
        ).then(res => res.json())) as {
          Sites: {
            Gogoanime?: Record<string, unknown>;
          };
        };

        const gogoanime = data.Sites.Gogoanime;

        let slug = null;

        if (gogoanime) {
          slug = Object.keys(gogoanime).find(key => !key.includes("-dub"));
        }

        console.log(slug);

        return {
          ...anime,
          slug,
        };
      } catch {
        console.error("Failed to fetch data for", anime.id);
      }
    })
  );

  return {
    pageInfo: response.data.Page.pageInfo,
    media: syncedData,
  };
};
