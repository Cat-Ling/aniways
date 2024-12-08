import { hiAnimeScraper } from "@aniways/hianime";

const TestPage = async ({
  searchParams: { page },
}: {
  searchParams: { page: string };
}) => {
  const p = Number(page);
  const anime = await hiAnimeScraper.getRecentlyReleasedAnime(
    Number.isNaN(p) ? 1 : p
  );

  const episodes = await hiAnimeScraper.getEpisodes(anime[0]!.id);

  const info = await hiAnimeScraper.getInfo(anime[0]!.id);
  const servers = await hiAnimeScraper.getServer(
    episodes.episodes[0]!.episodeId!
  );
  const sources = await hiAnimeScraper.getEpisodeSources(
    episodes.episodes[0]!.episodeId!,
    "hd-1"
  );

  return (
    <>
      <style>
        {`
        h1 {
          font-size: 1.5rem;
          margin-top: 1rem;
        }
        pre {
          font-size: 1rem;
          margin-top: 0.5rem;
        }
      `}
      </style>
      <form>
        <input type="text" name="page" defaultValue={page} />
      </form>
      <h1>Recently Released Anime</h1>
      <pre>{JSON.stringify(anime, null, 2)}</pre>
      <h1>Episodes of first</h1>
      <pre>{JSON.stringify(episodes, null, 2)}</pre>
      <h1>Info of first</h1>
      <pre>{JSON.stringify(info, null, 2)}</pre>
      <h1>Servers of first</h1>
      <pre>{JSON.stringify(servers, null, 2)}</pre>
      <h1>Sources of first episode</h1>
      <pre>{JSON.stringify(sources, null, 2)}</pre>
    </>
  );
};

export default TestPage;
