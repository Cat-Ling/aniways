import { api } from "./trpc";

export const syncSeasonalAnime = async () => {
  const seasonalAnimes = await api.seasonalAnime.getCurrentSeasonalAnimes();

  console.log("Fetched seasonal anime.");
  console.log(JSON.stringify(seasonalAnimes, null, 2));

  await api.seasonalAnime.saveSeasonalAnimes(
    seasonalAnimes.map((anime, i) => ({
      malId: anime.mal_id,
      order: i,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      imageUrl: anime.images.webp.large_image_url!,
      rating: anime.rating ?? "N/A",
      synopsis: anime.synopsis ?? "Not available.",
      type: anime.type ?? "N/A",
      episodes: anime.episodes,
      status: anime.status ?? "Not Yet Aired",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      title: anime.title!,
    }))
  );

  console.log("Synced seasonal anime.");
};
