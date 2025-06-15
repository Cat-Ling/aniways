import { Cluster } from 'puppeteer-cluster';
import puppeteer from 'puppeteer';

let cluster: Cluster<any, any>;

export async function initPuppeteerCluster() {
  if (!cluster) {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 2,
      puppeteer,
      puppeteerOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    process.on('SIGINT', async () => {
      await cluster.idle();
      await cluster.close();
    });

    console.log('Puppeteer cluster initialized');
  }
}

export function getPuppeteerCluster() {
  if (!cluster) throw new Error('Cluster not initialized');
  return cluster;
}
