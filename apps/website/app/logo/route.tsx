import { ImageResponse } from 'next/og';

export const GET = (req: Request) => {
  const response = new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={new URL(req.url).origin + '/logo.png'}
        width={128}
        height={128}
        style={{
          padding: '-32px',
        }}
      />
    ),
    {
      width: 128,
      height: 128,
    }
  );
  return response;
};
