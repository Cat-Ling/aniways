export const getMalIdFromSlug = async (slug: string) => {
  const url = `https://raw.githubusercontent.com/bal-mackup/mal-backup/master/page/Gogoanime/${slug}.json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch MAL ID");
  }

  const data = (await response.json()) as { malId: number } | null | undefined;

  if (!data?.malId) {
    throw new Error("Failed to fetch MAL ID");
  }

  return data.malId;
};
