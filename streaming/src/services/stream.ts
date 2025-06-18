import axios from 'axios';
import { getPuppeteerCluster } from '../config/puppeteer';
import { load } from 'cheerio';

async function fetchStreamingDataWithCheerio(
  id: number,
  type: 'sub' | 'dub' = 'sub'
) {
  const url = `https://megaplay.buzz/stream/s-2/${id}/${type}`;

  console.time(`Getting html page for ID: ${id}, Type: ${type} (cheerio)`);
  const { data: html } = await axios.get(url, {
    responseType: 'text',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      Referer: 'https://megaplay.buzz',
    },
  });

  const $ = load(html);
  console.timeEnd(`Getting html page for ID: ${id}, Type: ${type} (cheerio)`);

  const mediaId = $('#megaplay-player').attr('data-mediaid');

  if (!mediaId) {
    throw new Error('Media ID not found in the HTML');
  }

  console.time(
    `Fetching m3u8Data for ID: ${id}, Type: ${type}, MediaId: ${mediaId}`
  );
  const response = await axios.get(
    `https://megaplay.buzz/stream/getSources?id=${mediaId}}`,
    {
      responseType: 'json',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        Referer: url,
        Origin: 'https://megaplay.buzz',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }
  );
  console.timeEnd(
    `Fetching m3u8Data for ID: ${id}, Type: ${type}, MediaId: ${mediaId}`
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch M3U8 URL: ${response.statusText}`);
  }

  return response.data;
}

async function fetchStreamingDataWithPuppeteer(
  id: number,
  type: 'sub' | 'dub' = 'sub'
) {
  const cluster = getPuppeteerCluster();

  return await cluster.execute({ id, type }, async ({ page }) => {
    await page.setExtraHTTPHeaders({
      Referer: 'https://megaplay.buzz',
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

export async function getStreamingData(
  id: number,
  type: 'sub' | 'dub' = 'sub'
) {
  // try {
  //   console.log(
  //     `Fetching streaming data for ID: ${id}, Type: ${type} (cheerio)`
  //   );
  //   const data = await fetchStreamingDataWithCheerio(id, type);
  //   return data;
  // } catch (error) {
  try {
    // console.error('Cheerio fetch failed, falling back to Puppeteer:', error);
    const data = await fetchStreamingDataWithPuppeteer(id, type);
    return data;
  } catch (error) {
    console.error('Puppeteer fetch failed:', error);
    console.error('Error fetching streaming data:', error);
    throw new Error('Failed to fetch streaming data');
  }
  // }
}
