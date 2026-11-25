const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/** Collects express-validator results into a 422 with { field: message }. */
module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = {};
  for (const e of result.array({ onlyFirstError: true })) {
    const field = e.path.split('[')[0];
    if (!errors[field]) errors[field] = e.msg;
  }
  return next(new ApiError(422, 'Please check the highlighted fields.', errors));
};
