import searchAnimeFromJikan from './jikan';

export default async function searchAnime(query: string, page: number) {
  try {
    return await searchAnimeFromJikan(query, page);
  } catch (e) {
    console.error((e as any)?.response?.data ?? e);
    return {
      animes: [],
      hasNext: false,
    };
  }
}
