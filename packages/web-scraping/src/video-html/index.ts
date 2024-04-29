import parse from 'node-html-parser';

export default async function getVideoHTML(url: string) {
  const requestUrl = new URL(url);

  const response = await fetch(requestUrl).catch(err => {
    console.error(err);
    throw new Error('Failed to fetch episode HTML');
  });

  const html = await response.text();

  const dom = parse(html);

  dom
    .querySelector('head')
    ?.insertAdjacentHTML('beforeend', `<base href="${requestUrl.origin}">`);

  dom.querySelector('head')?.insertAdjacentHTML(
    'beforeend',
    `
    <script>
      window.addEventListener('load', () => {
        const link = document.querySelector('.linkserver[data-status="1"]');
        document.querySelector('.linkserver[data-status="0"]')?.remove();
        link.click();
      });
    </script>
  `
  );

  return dom.toString();
}
