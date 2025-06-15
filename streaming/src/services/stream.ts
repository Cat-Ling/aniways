import { getPuppeteerCluster } from '../config/puppeteer';

export async function getStreamingData(
  id: number,
  type: 'sub' | 'dub' = 'sub'
) {
  const cluster = getPuppeteerCluster();

  return cluster.execute({ id, type }, async ({ page, data }) => {
    await page.setExtraHTTPHeaders({
      Referer: 'https://megaplay.buzz/api',
    });

    const m3u8Data = new Promise((resolve, reject) => {
      page.on('response', async response => {
        const url = response.url();
        if (url.includes('getSources')) {
          try {
            const json = await response.json();
            resolve(json);
          } catch (err) {
            reject(err);
          }
        }
      });

      page.on('error', reject);
      page.on('pageerror', reject);
      page.on('requestfailed', reject);
    });

    await page.goto(`https://megaplay.buzz/stream/s-2/${id}/${type}`);

    return await m3u8Data;
  });
}
