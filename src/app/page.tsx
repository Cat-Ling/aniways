import { unstable_noStore } from 'next/cache';

const Home = async () => {
  unstable_noStore();

  const res = await fetch(
    // 'https://gogotaku.info/recent-release-anime?page=2'
    'https://anitaku.to/sousou-no-frieren-episode-1'
  ).then(res => res.text());

  return <div dangerouslySetInnerHTML={{ __html: res }} />;
};

export default Home;
