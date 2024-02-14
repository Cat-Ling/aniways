import { getUser } from '@animelist/auth-next/server';
import { getAnimeList } from '@data/anime';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type AnimeListPageProps = {
  searchParams: { page?: string };
};

const AnimeListPage = async (props: AnimeListPageProps) => {
  const { page = '1' } = props.searchParams;

  const user = await getUser(cookies());

  if (!user) {
    redirect('/?login=true');
  }

  const { accessToken } = user;

  const animeList = await getAnimeList(accessToken, Number(page));

  return (
    <>
      <h1>{user.user.name}'s Anime List</h1>
      <pre>{JSON.stringify(animeList, null, 2)}</pre>
    </>
  );
};

export default AnimeListPage;
