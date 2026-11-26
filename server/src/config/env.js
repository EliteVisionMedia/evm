const required = ['MONGODB_URI'];
for (const key of required) {
  if (!process.env[key]) {
    // Warn instead of exiting so the website keeps serving; /api/contact answers 503 until it is set.
    console.error(`[config] Missing required environment variable ${key}. Copy .env.example to .env and fill it in.`);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  /** Comma-separated list allowed, e.g. "http://localhost:5173,https://elitevisionmedia.com". */
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()).filter(Boolean),
  /** Resend email notifications for contact enquiries. Optional: leads are saved even if unset. */
  email: {
    apiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || '',
    to: (process.env.RECEIVER_EMAIL || '').split(',').map((s) => s.trim()).filter(Boolean),
  },
};
