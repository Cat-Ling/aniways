import { getAllAnimeUrlSource } from '@/data-access/anime';
import { notFound } from 'next/navigation';
import parse from 'node-html-parser';

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

  const data = script.innerText.replace('window.__NUXT__=', '');

  return (
    <>
      <a href={url}>{url}</a>
      <pre>{JSON.stringify(eval(data), null, 2)}</pre>
    </>
  );
};

export default AnimePage;
