import { getPuppeteerCluster } from '../config/puppeteer';

export async function getStreamingData(
  id: number,
  type: 'sub' | 'dub' = 'sub'
) {
  const cluster = getPuppeteerCluster();

  return await cluster.execute({ id, type }, async ({ page }) => {
    await page.setExtraHTTPHeaders({
      Referer: 'https://megaplay.buzz/api',
      Origin: 'https://megaplay.buzz',
    });

    const m3u8Data = new Promise((resolve, reject) => {
      page.on('response', async response => {
        const url = response.url();
        if (url.startsWith('https://megaplay.buzz/stream/getSources?id=')) {
          console.log('Response URL:', url);
          try {
            const json = await response.json();
            resolve(json);
          } catch (err) {
            reject(err);
          }
        }
      });
    });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    );

    await page.goto(`https://megaplay.buzz/stream/s-2/${id}/${type}`);

    return await m3u8Data;
  });
}
