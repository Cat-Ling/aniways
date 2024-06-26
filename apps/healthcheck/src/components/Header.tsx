import { Image } from "@aniways/ui/aniways-image";

export const Header = () => {
  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-3 md:container">
        <a href="https://aniways.xyz" className="flex items-center">
          <Image
            src="/logo.png"
            width={80}
            height={80}
            alt="AniWays Logo"
            className="-ml-3 h-20 w-20"
          />
          <h1 className="text-2xl font-bold">AniWays</h1>
        </a>
      </div>
    </nav>
  );
};
