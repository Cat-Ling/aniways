import { getUser } from '@animelist/auth-next/server';
import { schema } from '@aniways/database';
import { getAnimeDetailsFromMyAnimeList } from '@aniways/myanimelist';
import { cookies } from 'next/headers';

type AnimeMetadataProps = {
  anime: schema.AnimeWithRelations;
  episode: number;
};

export const AnimeMetadata = async ({ anime, episode }: AnimeMetadataProps) => {
  const user = await getUser(cookies());

  const details = await getAnimeDetailsFromMyAnimeList(
    user?.accessToken,
    anime.title,
    episode
  );

  return (
    <div className="mt-3">
      <pre>{JSON.stringify(details, null, 2)}</pre>
    </div>
  );
};
