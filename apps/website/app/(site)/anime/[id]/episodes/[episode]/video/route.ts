import { NextRequest } from 'next/server';
import { createEpisodeService } from '@aniways/data';
import { notFound } from 'next/navigation';

type Params = {
  id: string;
  episode: string;
};

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  const service = createEpisodeService();

  const iframe = await service
    .getEpisodeUrl(params.id, params.episode)
    .catch(err => {
      console.error(err);
      notFound();
    });

  const response = await service.getEpisodeHTML(iframe).catch(err => {
    console.error(err);
    notFound();
  });

  return response;
};
