type VideoFrameProps = {
  currentEpisode: string;
  animeId: string;
};

export const VideoFrame = async ({
  animeId,
  currentEpisode,
}: VideoFrameProps) => {
  return (
    <iframe
      src={`/anime/${animeId}/episodes/${currentEpisode}/video`}
      className="min-h-[260px] w-full md:aspect-video md:min-h-0"
      frameBorder="0"
      scrolling="no"
      allowFullScreen
    />
  );
};
