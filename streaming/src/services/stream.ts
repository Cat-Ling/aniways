import axios from 'axios';
import { getPuppeteerBrowser } from '../config/puppeteer';
import { load } from 'cheerio';

async function fetchStreamingDataWithCheerio(
  id: number,
  type: 'sub' | 'dub' = 'sub'
) {
  const url = `https://megaplay.buzz/stream/s-2/${id}/${type}`;

  console.time(`Cheerio HTML fetch ID:${id}, type:${type}`);
  const { data: html } = await axios.get<string>(url, {
    responseType: 'text',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      Referer: 'https://megaplay.buzz',
    },
  });
  console.timeEnd(`Cheerio HTML fetch ID:${id}, type:${type}`);

  const $ = load(html);
  const mediaId = $('#megaplay-player').attr('data-id');
  if (!mediaId) throw new Error('Media ID not found in the HTML');

  console.time(`Cheerio JSON fetch ID:${id}, mediaId:${mediaId}`);
  const response = await axios.get(
    `https://megaplay.buzz/stream/getSources?id=${mediaId}`,
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
      },
    }
  );
  console.timeEnd(`Cheerio JSON fetch ID:${id}, mediaId:${mediaId}`);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch M3U8 URL: ${response.statusText}`);
  }

  return response.data;
}

async function fetchStreamingDataWithPuppeteer(
  id: number,
  type: 'sub' | 'dub' = 'sub'
) {
  const browser = getPuppeteerBrowser();
  const page = await browser.newPage();

  try {
    // 1) block devtools detector script
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (
        req.resourceType() === 'script' &&
        /devtools|detect/i.test(req.url())
      ) {
        return req.abort();
      }
      req.continue();
    });

    // 2) UA & headers
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/58.0.3029.110 Safari/537.3'
    );
    await page.setExtraHTTPHeaders({
      Referer: 'https://megaplay.buzz',
      Origin: 'https://megaplay.buzz',
    });

    // 3) navigate
    const url = `https://megaplay.buzz/stream/s-2/${id}/${type}`;
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
    if (!resp) throw new Error('Navigation failed');

    // 4) wait for JSON
    const jsonResp = await page.waitForResponse(
      r => r.url().includes('/stream/getSources?id=') && r.ok(),
      { timeout: 15_000 }
    );
    return await jsonResp.json();
  } finally {
    await page.close();
  }
}

export async function getStreamingData(
  id: number,
  type: 'sub' | 'dub' = 'sub'
) {
  try {
    return await fetchStreamingDataWithCheerio(id, type);
  } catch (cheerioErr) {
    console.warn('Cheerio failed, falling back to Puppeteer:', cheerioErr);
    try {
      return await fetchStreamingDataWithPuppeteer(id, type);
    } catch (puppeteerErr) {
      console.error('Puppeteer fetch failed:', puppeteerErr);
      throw new Error('Failed to fetch streaming data');
    }
  }
}
