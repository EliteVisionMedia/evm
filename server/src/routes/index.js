const router = require('express').Router();
const { health } = require('../controllers/healthController');

router.get('/health', health);
router.use('/contact', require('./contactRoutes'));

module.exports = router;
