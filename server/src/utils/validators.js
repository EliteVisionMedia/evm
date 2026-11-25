/** Shared validation rules, kept in sync with the frontend Contact form. */
const PHONE_PATTERN = /^\+?[\d\s()-]{7,18}$/;
const MIN_PHONE_DIGITS = 7;

const isValidPhone = (value) => PHONE_PATTERN.test(value) && value.replace(/\D/g, '').length >= MIN_PHONE_DIGITS;

const SERVICE_OPTIONS = [
  'Digital Marketing',
  'Web Design & Development',
  'Video Production',
  'Photography',
  'Model Photoshoot',
  'Product Shoot',
  'Graphics Design',
  '2D / 3D Animation',
  'AI Videos',
  'Branding & Visual Identity',
  'Other',
];

module.exports = { isValidPhone, SERVICE_OPTIONS };
