import parse from 'node-html-parser';

const AnimeStreamingPage = async ({
  params: { name, episode },
}: {
  params: {
    name: string;
    episode: string;
  };
}) => {
  // need to move this to data-access module with better error handling and more sources
  const endpoint = `https://embtaku.pro/videos/${name}-episode-${episode}`;
  const html = await fetch(endpoint).then(res => res.text());
  const dom = parse(html);

  const iframe = dom.querySelector('iframe')?.getAttribute('src');

  return (
    <>
      <h1 className="text-2xl font-bold capitalize">
        {decodeURIComponent(name).split('-').join(' ')} - Episode {episode}
      </h1>
      <iframe
        src={iframe}
        className="aspect-video w-full overflow-hidden"
        frameBorder="0"
        allowFullScreen
      />
    </>
  );
};

export default AnimeStreamingPage;
