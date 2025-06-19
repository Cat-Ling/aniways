import puppeteer, { Browser } from 'puppeteer';

let browser: Browser | null = null;
let initPromise: Promise<Browser> | null = null;

/**
 * Initialize (or return existing) Puppeteer browser.
 * Ensures only one launch in flight and auto-relaunches on disconnect.
 */
export function initBrowser(): Promise<Browser> {
  if (browser) {
    return Promise.resolve(browser);
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async (): Promise<Browser> => {
    const b = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
      executablePath:
        process.env.NODE_ENV === 'production' ? '/usr/bin/chromium' : undefined,
    });

    // Auto-relaunch on disconnect
    b.on('disconnected', () => {
      console.warn('🚨 Puppeteer browser disconnected. Reinitializing...');
      browser = null;
      initPromise = null;
      initBrowser().catch(err =>
        console.error('Error reinitializing browser:', err)
      );
    });

    // Graceful shutdown on process exit
    const closeBrowser = async () => {
      if (browser) {
        try {
          await browser.close();
        } catch (err) {
          console.error('Error closing Puppeteer browser:', err);
        }
      }
    };
    process.once('SIGINT', closeBrowser);
    process.once('SIGTERM', closeBrowser);

    browser = b;
    initPromise = null;

    console.log('✅ Puppeteer browser launched');
    return b;
  })();

  return initPromise;
}

/**
 * Retrieve the initialized Puppeteer browser instance.
 * Throws if initBrowser() was not called first.
 */
export function getPuppeteerBrowser(): Browser {
  if (!browser) {
    throw new Error(
      'Puppeteer browser is not initialized. Call initBrowser() first.'
    );
  }
  return browser;
}
