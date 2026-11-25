const mongoose = require('mongoose');

const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

exports.health = (req, res) => {
  const db = states[mongoose.connection.readyState] || 'unknown';
  res.status(db === 'connected' ? 200 : 503).json({
    success: db === 'connected',
    status: db === 'connected' ? 'ok' : 'degraded',
    database: db,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};
