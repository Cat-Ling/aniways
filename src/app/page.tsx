import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { parse } from 'node-html-parser';

const Home = async ({
  searchParams: { page },
}: {
  searchParams: { page: string };
}) => {
  const res = await fetch(
    'https://gogotaku.info/recent-release-anime?page=' + (page || 1),
    {
      next: {
        revalidate: 60,
      },
    }
  ).then(res => res.text());

  const recentlyReleased = parse(res)
    .querySelectorAll('.main_body .page_content li')
    .map(li => {
      const image = li
        .querySelector('.img a img')
        ?.getAttribute('data-original');
      const name = li.querySelector('.name')?.innerText.trim();
      const episode = li
        .querySelector('p.released')
        ?.innerText.trim()
        .slice(-1);
      const url =
        li.querySelector('.name a')?.getAttribute('href')?.split('/').at(-1) +
        '-episode-' +
        episode;

      return {
        name,
        image,
        episode,
        url: url,
      };
    });

  return (
    <div className="container mx-auto p-6">
      <div className="w-full flex justify-between mb-5 items-center">
        <h1 className="text-2xl font-bold">Recently Released</h1>
        <div className="flex items-center gap-3">
          <Button
            size={'icon'}
            variant={'ghost'}
            disabled={Number(page || 1) === 1}
          >
            <Link href={`/?page=${Number(page || 1) - 1}`}>
              <ArrowLeft />
            </Link>
          </Button>
          <p className="text-muted-foreground">{page || 1}</p>
          <Button size={'icon'} variant={'ghost'}>
            <Link href={`/?page=${Number(page || 1) + 1}`}>
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
      <ul className="grid grid-cols-6 gap-3 h-full">
        {recentlyReleased.map(({ name, image, episode, url }, i) => (
          <li
            key={i}
            className="bg-background border rounded-md border-border p-2"
          >
            <a
              href={`https://anitaku.to/${url}`}
              className="h-full flex flex-col gap-3"
            >
              <div
                className="w-full aspect-[450/650] bg-cover rounded-md"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />
              <div className="flex justify-between flex-col flex-1">
                <p className="text-sm line-clamp-2">{name}</p>
                <p className="text-sm text-muted-foreground">
                  Episode {episode}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
