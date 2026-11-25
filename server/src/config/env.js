const required = ['MONGODB_URI'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[config] Missing required environment variable ${key}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  /** Comma-separated list allowed, e.g. "http://localhost:5173,https://elitevisionmedia.com". */
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()).filter(Boolean),
};
