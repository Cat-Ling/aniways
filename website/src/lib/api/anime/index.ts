import { fetchJson } from '$lib/api';
import { error } from '@sveltejs/kit';
import { formatDuration, secondsToMinutes } from 'date-fns/fp';
import {
  anilistAnime,
  animeBanner,
  anime as animeSchema,
  episode,
  episodeServer,
  paginatedAnime,
  streamInfo,
  topAnime,
  trailer as trailerSchema
} from './types';
import { PUBLIC_STREAMING_URL } from '$env/static/public';

export const getSeasonalAnime = async (fetch: typeof global.fetch) => {
  return fetchJson(fetch, '/anime/seasonal', anilistAnime.array());
};

export const getBannerOfAnime = async (fetch: typeof global.fetch, id: string) => {
  return fetchJson(fetch, `/anime/${id}/banner`, animeBanner);
};

export const getTrendingAnime = async (fetch: typeof global.fetch) => {
  return fetchJson(fetch, '/anime/trending', animeSchema.array());
};

export const getTopAnime = async (fetch: typeof global.fetch) => {
  return fetchJson(fetch, '/anime/top', topAnime);
};

export const getPopularAnime = async (fetch: typeof global.fetch) => {
  return fetchJson(fetch, '/anime/popular', animeSchema.array());
};

export const getRecentlyUpdatedAnime = async (
  fetch: typeof global.fetch,
  page: number,
  itemsPerPage: number
) => {
  return fetchJson(
    fetch,
    `/anime/recently-updated?page=${page}&itemsPerPage=${itemsPerPage}`,
    paginatedAnime
  );
};

export const searchAnime = async (
  fetch: typeof global.fetch,
  query: string,
  genre: string | undefined,
  page: number,
  itemsPerPage: number,
  abortSignal?: AbortSignal
) => {
  return fetchJson(fetch, `/anime/search`, paginatedAnime, {
    signal: abortSignal,
    params: { query, genre, page, itemsPerPage }
  });
};

export const getAnimeMetadata = async (fetch: typeof global.fetch, id: string) => {
  const anime = await fetchJson(fetch, `/anime/${id}`, animeSchema);

  const metadata = anime.metadata;

  if (!metadata) {
    error(404, 'Anime not found');
  }

  return {
    ...anime,
    ...anime.metadata,
    metadata: undefined,
    picture: metadata.mainPicture ?? anime.poster,
    score: `${metadata.mean ?? 0.0} (${Intl.NumberFormat().format(metadata.scoringUsers ?? 0)} users)`,
    season: metadata.season ? `${metadata.season} ${metadata.seasonYear}` : '???',
    source: metadata.source?.replace('_', ' ') ?? '???',
    avgEpDuration: formatDuration({
      minutes: secondsToMinutes(metadata.avgEpDuration ?? 0)
    }),
    airing: metadata.airingStart
      ? `${metadata.airingStart} - ${metadata.airingEnd ?? '???'}`
      : '???'
  };
};

export const getSeasonsAndRelatedAnimes = async (fetch: typeof global.fetch, id: string) => {
  const [seasons, related, franchise] = await Promise.all([
    fetchJson(fetch, `/anime/${id}/seasons`, animeSchema.array()).catch(() => []),
    fetchJson(fetch, `/anime/${id}/related`, animeSchema.array()).catch(() => []),
    fetchJson(fetch, `/anime/${id}/franchise`, animeSchema.array()).catch(() => [])
  ]);

  if (seasons.length > 1 && seasons.some((a) => a.id === id)) {
    return [
      { label: 'Seasons', value: seasons },
      { label: 'Related anime', value: related.toReversed() }
    ].filter((d) => d.value.length > 0);
  }

  return [
    { label: 'Seasons', value: [] },
    { label: 'Related anime', value: franchise.filter((f) => f.id !== id).toReversed() }
  ].filter((d) => d.value.length > 0);
};

export const getTrailer = async (fetch: typeof global.fetch, id: string, signal?: AbortSignal) => {
  return fetchJson(fetch, `/anime/${id}/trailer`, trailerSchema, { signal });
};

export const getEpisodes = async (fetch: typeof global.fetch, id: string) => {
  return fetchJson(fetch, `/anime/${id}/episodes`, episode.array());
};

export const getServersOfEpisode = async (fetch: typeof global.fetch, episodeId: string) => {
  return fetchJson(fetch, `/anime/episodes/servers/${episodeId}`, episodeServer.array());
};

export const getGenres = async (fetch: typeof global.fetch) => {
  const genres = await fetchJson(fetch, '/anime/genres', {
    assert: (data) => data as string[]
  });

  return genres
    .filter((genre) => genre !== 'unknown')
    .map((genre) => ({
      slug: genre.replace(/\s/g, '-').toLowerCase(),
      name: genre
    }));
};

export const getAnimeByGenre = async (
  fetch: typeof global.fetch,
  genre: string,
  page: number,
  itemsPerPage: number
) => {
  return fetchJson(fetch, `/anime/genres/${genre}`, paginatedAnime, {
    params: { page, itemsPerPage }
  });
};

export const getRandomAnime = async (fetch: typeof global.fetch) => {
  return fetchJson(fetch, '/anime/random', animeSchema);
};

export const getRandomAnimeByGenre = async (fetch: typeof global.fetch, genre: string) => {
  return fetchJson(fetch, `/anime/random/${genre}`, animeSchema);
};

export const getStreamingData = async (fetch: typeof global.fetch, serverId: string) => {
  const response = await fetch(`${PUBLIC_STREAMING_URL}/info/${serverId}`)
    .then((res) => res.json())
    .then(streamInfo.assert);

  return {
    ...response,
    sources: response.sources.map((source) => ({
      ...source,
      file: `${PUBLIC_STREAMING_URL}${source.file}`
    }))
  };
};
