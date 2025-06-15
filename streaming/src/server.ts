import Elysia from 'elysia';
import { infoRoute } from './routes/info';
import { proxyRoute } from './routes/proxy';

export async function startServer() {
  new Elysia({ serve: { idleTimeout: 25 } })
    .use(infoRoute)
    .use(proxyRoute)
    .listen(1234, () => {
      console.log('Server running at http://localhost:1234');
    });
}
