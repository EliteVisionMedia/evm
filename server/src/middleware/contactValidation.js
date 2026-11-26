const { body } = require('express-validator');
const { isValidPhone, SERVICE_OPTIONS } = require('../utils/validators');

/** Removes angle brackets and control characters from free text. */
const clean = (v) => (typeof v === 'string' ? v.replace(/[<>]/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') : v);

const requiredText = (field, label, max) =>
  body(field)
    .exists({ values: 'falsy' }).withMessage(`${label} is required.`).bail()
    .isString().withMessage(`${label} must be text.`).bail()
    .trim()
    .customSanitizer(clean)
    .notEmpty().withMessage(`${label} is required.`).bail()
    .isLength({ max }).withMessage(`${label} must be at most ${max} characters.`);

module.exports = [
  requiredText('firstName', 'First name', 60),
  requiredText('lastName', 'Last name', 60),
  requiredText('location', 'Location', 120),

  body('email')
    .exists({ values: 'falsy' }).withMessage('Email address is required.').bail()
    .isString().withMessage('Email address is invalid.').bail()
    .trim()
    .isEmail().withMessage('Please enter a valid email address.').bail()
    .isLength({ max: 254 }).withMessage('Email address is too long.')
    .normalizeEmail({ gmail_remove_dots: false }),

  body('phone')
    .exists({ values: 'falsy' }).withMessage('Phone number is required.').bail()
    .isString().withMessage('Phone number is invalid.').bail()
    .trim()
    .notEmpty().withMessage('Phone number is required.').bail()
    .custom(isValidPhone).withMessage('Please enter a valid phone number.'),

  body('services')
    .isArray({ min: 1 }).withMessage('Please select at least one service.').bail()
    .custom((arr) => arr.length <= SERVICE_OPTIONS.length).withMessage('Too many services selected.').bail()
    .custom((arr) => arr.every((s) => typeof s === 'string' && SERVICE_OPTIONS.includes(s.trim())))
    .withMessage('One or more selected services are not recognised.')
    .customSanitizer((arr) => [...new Set(arr.map((s) => s.trim()))]),

  // Message is optional: absent, null or empty string are all accepted.
  body('message')
    .optional({ values: 'null' })
    .isString().withMessage('Message must be text.').bail()
    .trim()
    .customSanitizer(clean)
    .isLength({ max: 5000 }).withMessage('Message must be at most 5000 characters.'),
];
