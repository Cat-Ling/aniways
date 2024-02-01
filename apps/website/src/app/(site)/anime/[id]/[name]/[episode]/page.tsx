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

  const key = Object.keys(data.fetch)[0] as keyof typeof data.fetch;

  if (!key) {
    return notFound();
  }

  const { show, episodeSelections } = data.fetch[key]!;

  if (!episodeSelections || episodeSelections.length === 0) {
    return notFound();
  }

  const [episodeVideoSource] = episodeSelections
    .sort((a, b) => {
      if (
        a.sourceUrl.includes('embtaku.pro') ||
        a.downloadUrl?.includes('embtaku.pro')
      )
        return -1;
      return b.priority - a.priority;
    })
    .map(e => {
      // some sources are not working, so we need to fix them
      if (e.downloadUrl?.includes('embtaku.pro')) {
        return {
          ...e,
          sourceUrl: e.sourceUrl.startsWith('/')
            ? `https://embtaku.pro/streaming.php?${e.sourceUrl.split('?')[1]}`
            : e.sourceUrl,
        };
      }
      return e;
    })
    .filter(e => e.sourceUrl.startsWith('http'));

  return (
    <>
      <h2 className="mb-3 text-xl font-bold">
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
