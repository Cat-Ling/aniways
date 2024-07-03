export const getMalIdFromSlug = async (slug: string) => {
  const url = `https://raw.githubusercontent.com/bal-mackup/mal-backup/master/page/Gogoanime/${slug}.json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch MAL ID");
  }

  const data = (await response.json()) as { malId?: number } | null | undefined;

  if (!data?.malId) {
    throw new Error("Failed to fetch MAL ID");
  }

  return data.malId;
};

export const getGogoSlugFromMalId = async (malId: number) => {
  const url = `https://raw.githubusercontent.com/bal-mackup/mal-backup/master/mal/anime/${malId}.json`;

  const response = await fetch(url);

  if (!response.ok) return null;

  const data = (await response.json()) as
    | {
        Sites: {
          Gogoanime?: Record<string, unknown>;
        };
      }
    | null
    | undefined;

  const gogoanime = data?.Sites.Gogoanime;

  let slug = null;

  if (gogoanime) {
    slug = Object.keys(gogoanime).find(key => !key.includes("-dub"));
  }

  return slug ?? null;
};
