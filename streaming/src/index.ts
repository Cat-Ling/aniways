import { startServer } from './server';
import { initRedis } from './config/redis';
import { initBrowser } from './config/puppeteer';

async function bootstrap() {
  await initRedis();
  await initBrowser();
  await startServer();
}

bootstrap().catch(err => {
  console.error('Startup Error:', err);
  process.exit(1);
});
