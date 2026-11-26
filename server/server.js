require('dotenv').config();
const app = require('./src/app');
const env = require('./src/config/env');
const { connectDB, disconnectDB } = require('./src/config/db');

async function start() {
  const server = app.listen(env.port, () => console.log(`[server] API listening on http://localhost:${env.port}`));
  // Connect after listening so the website stays up even if MongoDB is slow or unreachable.
  const tryConnect = () => connectDB(env.mongoUri).catch((err) => { console.error('[db]', err.message); setTimeout(tryConnect, 30000); });
  if (env.mongoUri) tryConnect();
  server.on('error', async (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[server] Port ${env.port} is already in use. Another EVM server (or app) is still running. Stop it, then start again.`);
    } else {
      console.error('[server] HTTP server error:', err.message);
    }
    await disconnectDB();
    process.exit(1);
  });

  const shutdown = async (signal) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('[server] failed to start:', err.message);
  process.exit(1);
});
