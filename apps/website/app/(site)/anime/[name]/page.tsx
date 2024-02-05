import { RedirectType, redirect } from 'next/navigation';

const AnimeDetailsPage = async ({
  params: { name },
}: {
  params: { name: string };
}) => {
  // TODO: Fetch anime details and redirect to the first episode
  redirect(`/anime/${name}/episodes/1`, RedirectType.replace);
};

export default AnimeDetailsPage;
