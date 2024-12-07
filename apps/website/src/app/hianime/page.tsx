import { getRecentlyReleasedAnime } from "@aniways/hianime";

const TestPage = async ({
  searchParams: { page },
}: {
  searchParams: { page: string };
}) => {
  const p = Number(page);
  const anime = await getRecentlyReleasedAnime(Number.isNaN(p) ? 1 : p);

  return (
    <>
      <form>
        <input type="text" name="page" defaultValue={page} />
      </form>
      <pre>{JSON.stringify(anime, null, 2)}</pre>
    </>
  );
};

export default TestPage;
