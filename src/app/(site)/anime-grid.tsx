import { Play } from 'lucide-react';

type AnimeGridProps = {
  anime: {
    name: string;
    image: string;
    episode: string;
    url: string;
    type: string;
  }[];
};

export const AnimeGrid = ({ anime }: AnimeGridProps) => {
  return (
    <ul className="grid grid-cols-6 gap-3 h-full">
      {anime.map(({ name, image, episode, url, type }, i) => (
        <li
          key={i}
          className="bg-background border rounded-md border-border p-2 group"
        >
          <a href={`${url}`} className="h-full flex flex-col gap-3">
            <div className="relative">
              <div
                className="w-full aspect-[450/650] bg-cover rounded-md"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />
              <div className="absolute left-0 top-0 w-full h-full bg-muted/70 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition flex items-center justify-center flex-col">
                <Play className="w-8 h-8 text-primary" />
                <p className="text-foreground mt-2 text-lg font-bold">
                  Watch Now
                </p>
              </div>
              <div className="absolute bottom-0 left-0 bg-primary text-sm p-1 rounded-bl-md rounded-tr-md">
                {type}
              </div>
            </div>
            <div className="flex justify-between flex-col flex-1">
              <p className="text-sm line-clamp-2 group-hover:text-primary transition">
                {name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Episode {episode}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};
