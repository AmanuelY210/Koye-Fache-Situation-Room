const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/:type/:format', authenticate, authorize('admin', 'super_admin'), generateReport);
router.get('/:type', authenticate, authorize('admin', 'super_admin'), generateReport);

module.exports = router;
