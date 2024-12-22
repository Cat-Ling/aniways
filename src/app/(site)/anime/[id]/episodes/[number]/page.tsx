const AnimeStreamingPage = async () => {
  return (
    <>
      {/* <div className="mb-3">
        <h1 className="text-xl font-bold">{anime.anime.info.name}</h1>
        <h2 className="text-lg font-normal text-muted-foreground">
          Episode {episode}
        </h2>
      </div> */}
      <div className="mb-2 flex-1">
        hello
        {/* <Suspense
          fallback={
            <Skeleton className="min-h-[260px] w-full md:aspect-video md:min-h-0" />
          }
        >
          <VideoPlayer
            animeId={id}
            malId={anime.malAnimeId}
            episode={episode}
            nextEpisode={
              nextEpisode
                ? `/anime/${id}/episodes/${nextEpisode.episode}`
                : null
            }
          />
        </Suspense> */}
      </div>
    </>
  );
};

export default AnimeStreamingPage;
