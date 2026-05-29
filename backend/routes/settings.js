const express = require('express');
const router = express.Router();
const {
  getSettings, updateSettings, uploadLogo, removeLogo, getAuditLogs
} = require('../controllers/settingsController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getSettings);
router.put('/', authenticate, authorize('admin', 'super_admin'), updateSettings);
router.post('/logo', authenticate, authorize('admin', 'super_admin'), upload.single('logo'), uploadLogo);
router.delete('/logo', authenticate, authorize('admin', 'super_admin'), removeLogo);
router.get('/audit-logs', authenticate, authorize('admin', 'super_admin'), getAuditLogs);

module.exports = router;
