import { db, orm, schema } from '@aniways/database';
import {
  auth,
  getAnimeList,
  getCurrentAnimeSeason,
} from '@aniways/myanimelist';
import { Skeleton } from '@ui/components/ui/skeleton';
import { cookies } from 'next/headers';
import { ReactNode, Suspense } from 'react';
import { AnimeGrid, AnimeGridLoader } from '../anime-grid';
import { AnimeCarousel } from './carousel';
import { unstable_noStore } from 'next/cache';

type HomeLayoutProps = {
  children: ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Suspense fallback={<Skeleton className="mb-2 h-[430px] md:mb-5" />}>
        <SeasonalAnimeCarousel />
      </Suspense>
      <Suspense
        fallback={
          <>
            <Skeleton className="mb-2 h-[32px] md:mb-5" />
            <div className="mb-12">
              <AnimeGridLoader length={5} />
            </div>
          </>
        }
      >
        <CurrentlyWatchingAnime />
      </Suspense>
      {children}
    </>
  );
}

const SeasonalAnimeCarousel = async () => {
  unstable_noStore();

  const seasonalAnime = await getCurrentAnimeSeason().then(({ data }) =>
    data.slice(0, 5)
  );

  const animes = await db
    .select()
    .from(schema.anime)
    .where(
      orm.inArray(
        schema.anime.malAnimeId,
        seasonalAnime.map(anime => anime.mal_id!)
      )
    );

  const animeMap = animes.reduce(
    (acc, anime) => {
      if (!anime.malAnimeId) return acc;
      acc[anime.malAnimeId] = anime;
      return acc;
    },
    {} as Record<number, (typeof animes)[number]>
  );

  return <AnimeCarousel seasonalAnime={seasonalAnime} animeMap={animeMap} />;
};

const CurrentlyWatchingAnime = async () => {
  const user = await auth(cookies());

  if (!user) return undefined;

  const {
    accessToken,
    user: { name: username },
  } = user;

  const animeList = await getAnimeList(
    accessToken,
    username,
    1,
    50,
    'watching'
  );

  const currentlyWatchingAnime = await db
    .select()
    .from(schema.anime)
    .where(
      orm.inArray(
        schema.anime.malAnimeId,
        animeList.data.map(({ node }) => node.id)
      )
    );

  const animeListMap = animeList.data.reduce(
    (acc, { node }) => {
      acc[node.id] = node;
      return acc;
    },
    {} as Record<number, (typeof animeList)['data'][number]['node']>
  );

  const newReleases = currentlyWatchingAnime
    .filter(
      anime =>
        anime.malAnimeId &&
        Number(anime.lastEpisode) !==
          animeListMap[anime.malAnimeId]?.my_list_status?.num_episodes_watched
    )
    .map(anime => {
      const episodesWatched =
        animeListMap[anime.malAnimeId!]?.my_list_status?.num_episodes_watched;

      const lastEpisode = String(
        episodesWatched !== undefined ? episodesWatched + 1 : anime.lastEpisode
      );

      return {
        ...anime,
        lastEpisode,
      };
    })
    .sort((a, b) => {
      const aLastUpdated =
        animeListMap[a.malAnimeId!]?.my_list_status?.updated_at;
      const bLastUpdated =
        animeListMap[b.malAnimeId!]?.my_list_status?.updated_at;

      if (aLastUpdated && bLastUpdated) {
        return new Date(aLastUpdated) > new Date(bLastUpdated) ? -1 : 1;
      }

      return 0;
    });

  if (!newReleases.length) return undefined;

  return (
    <>
      <h1 className="mb-2 text-lg font-bold md:mb-5 md:text-2xl">
        Continue Watching
      </h1>
      <div className="mb-6">
        <AnimeGrid animes={newReleases} type="home" />
      </div>
    </>
  );
};
