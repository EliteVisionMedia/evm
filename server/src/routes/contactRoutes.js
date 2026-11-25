const router = require('express').Router();
const contactValidation = require('../middleware/contactValidation');
const validate = require('../middleware/validate');
const requireDb = require('../middleware/requireDb');
const { submitContact } = require('../controllers/contactController');

router.post('/', contactValidation, validate, requireDb, submitContact);

module.exports = router;
