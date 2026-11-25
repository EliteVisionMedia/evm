const env = require('../config/env');

/**
 * Central error handler. Returns a consistent JSON shape and never leaks
 * stack traces, query details or database internals to the client.
 */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Something went wrong. Please try again later.';
  let errors = err.errors && err.isOperational ? err.errors : undefined;

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body must be valid JSON.';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body is too large.';
  } else if (err.name === 'ValidationError' && err.errors) {
    // Mongoose schema validation (second line of defence after express-validator).
    status = 422;
    message = 'Please check the highlighted fields.';
    errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
  } else if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
    status = 503;
    message = 'Service temporarily unavailable. Please try again shortly.';
  }

  if (status >= 500) console.error('[error]', err.name, err.message, env.nodeEnv !== 'production' ? err.stack : '');

  res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
};
