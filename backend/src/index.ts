import app from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║         Fleet AI API v1.0.0           ║
  ║   http://localhost:${env.port}/api          ║
  ║   Mock: ${env.useMockData ? 'ON ' : 'OFF'}                          ║
  ╚═══════════════════════════════════════╝
  `);
});
