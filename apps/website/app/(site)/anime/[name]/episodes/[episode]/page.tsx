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

  const nameOfAnime = decodeURIComponent(name).split('-').join(' ');

  return (
    <>
      <h1 className="mb-3 text-xl font-bold capitalize">
        {nameOfAnime} -{' '}
        <span className="text-muted-foreground font-normal">
          Episode {episode}
        </span>
      </h1>
      <iframe
        src={iframe}
        className="aspect-video w-full overflow-hidden"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      />
    </>
  );
};

export default AnimeStreamingPage;
