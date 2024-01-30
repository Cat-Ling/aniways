import { AllAnimeShowInfo, getAllAnimeUrlSource } from '@/data-access/anime';
import { notFound } from 'next/navigation';
import parse from 'node-html-parser';

type AnimeSource = {
  sourceUrl: string;
  priority: number;
  sourceName: string;
  type: 'iframe' | 'player';
  className: string;
  streamerId: string;
  active: boolean;
  index: number;
  downloads?: {
    sourceName: string;
    downloadUrl: string;
  };
  originalSourceName?: string;
  downloadUrl?: string;
  sandbox?: string;
  links?: { url: string; label: string }[];
};

type AnimeSourcesList = AnimeSource[];

const AnimePage = async ({
  params: { id, name, episode },
}: {
  params: { id: string; name: string; episode: string };
}) => {
  const url = getAllAnimeUrlSource({
    id,
    name,
    episode: Number(episode),
  });

  const res = await fetch(url, {
    headers: {
      origin: 'https://allmango.to',
    },
  }).then(res => res.text());

  const script = parse(res)
    .querySelectorAll('script')
    .find(s => s.innerText.startsWith('window.__NUXT__='));

  if (!script) {
    return notFound();
  }

  const data = eval(script.innerText.replace('window.__NUXT__=', '')) as {
    fetch: {
      [key: string]: {
        episodeSelections: AnimeSourcesList;
        show: AllAnimeShowInfo;
      };
    };
  };

  const { show, episodeSelections } = data.fetch[Object.keys(data.fetch)[0]];

  const [episodeVideoSource] = episodeSelections.filter(e =>
    e.sourceUrl.startsWith('http')
  );

  return (
    <>
      <h2 className="font-bold text-xl mb-3">
        {show.name} -{' '}
        <span className="text-muted-foreground font-normal">
          Episode {episode}
        </span>
      </h2>
      <iframe
        src={episodeVideoSource.sourceUrl}
        sandbox={episodeVideoSource.sandbox}
        className="aspect-video w-full overflow-hidden"
        allowFullScreen={true}
        scrolling="no"
      />
    </>
  );
};

export default AnimePage;
