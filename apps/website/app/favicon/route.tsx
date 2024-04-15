import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export const GET = (req: Request) => {
  const response = new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={new URL(req.url).origin + '/logo.png'}
        width={32}
        height={32}
        style={{
          padding: '-8px',
        }}
      />
    ),
    {
      width: 32,
      height: 32,
    }
  );
  return response;
};
