const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

/** Fails fast with 503 instead of buffering queries while the database is unreachable. */
module.exports = (req, res, next) =>
  mongoose.connection.readyState === 1 ? next() : next(new ApiError(503, 'Service temporarily unavailable. Please try again shortly.'));
