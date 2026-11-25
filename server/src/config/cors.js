const env = require('./env');

module.exports = {
  origin(origin, cb) {
    // Allow same-origin / server-to-server requests (no Origin header) and the configured frontends.
    if (!origin || env.clientUrls.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
};
