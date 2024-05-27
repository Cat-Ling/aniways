import { APIGatewayProxyHandler } from 'aws-lambda';
import { EpisodeService } from '@aniways/data';
import { z } from 'zod';

const PathSchema = z.tuple([
  z.string().cuid2(),
  z.coerce.number().transform(value => value.toString()),
]);

export const getVideo: APIGatewayProxyHandler = async ({ path }) => {
  console.log('path', path);

  try {
    const [videoId, episode] = PathSchema.parse(path.split('/').slice(1));

    const service = new EpisodeService();

    const url = await service.getEpisodeUrl(videoId, episode);

    let html = await fetch(url).then(response => response.text());

    // add meta base tag
    const baseTag = `<base href="${new URL(url).origin}">`;
    const headEnd = html.indexOf('</head>');
    html = html.slice(0, headEnd) + baseTag + html.slice(headEnd);

    // remove scripts which contains ads
    const adsScript = `
      <script>
        Array.from(document.querySelectorAll('script')).forEach(script => {
          if (script.src.includes('ads')) {
            script.remove();
          }
        })
      </script>`;
    const bodyStart = html.indexOf('<body');
    html = html.slice(0, bodyStart) + adsScript + html.slice(bodyStart);

    const script = `
      <script>
        const removeUnusedLinks = () => {
          const link = document.querySelector('.linkserver[data-status="1"]');
          document.querySelector('.linkserver[data-status="0"]')?.remove();
          link.click();
        }

        const observer = new MutationObserver(() => {
          const iframes = Array.from(document.querySelectorAll('iframe'));
          for (const iframe of iframes) {
            if (iframe.parentElement.id === 'load-iframe') {
              continue;
            }
            iframe.remove();
          }
        })

        window.addEventListener('load', () => {
          removeUnusedLinks();
          observer.observe(document.querySelector('html'), { childList: true, subtree: true });
        });
      </script>`;

    const bodyEnd = html.indexOf('</body>');
    html = html.slice(0, bodyEnd) + script + html.slice(bodyEnd);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
      body: html,
    };
  } catch (error) {
    console.error('error', error);

    if (error instanceof z.ZodError) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Not Found',
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};
