import { startServer } from './server';
import { initRedis } from './config/redis';
import { initPuppeteerCluster } from './config/puppeteer';

async function bootstrap() {
  console.log({
    NODE_ENV: process.env.NODE_ENV,
    REDIS_URL: process.env.REDIS_URL,
    PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
  });
  await initRedis();
  await initPuppeteerCluster();
  await startServer();
}

bootstrap().catch(err => {
  console.error('Startup Error:', err);
  process.exit(1);
});
