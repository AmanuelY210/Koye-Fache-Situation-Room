const express = require('express');
const router = express.Router();
const {
  createSubmission, getMySubmissions, getMyStats,
  getAllSubmissions, approveSubmission, rejectSubmission,
  updateSubmission, deleteSubmission, getTotalApprovedElectors,
  getSubmissionsByDateRange
} = require('../controllers/electorController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/live-total', getTotalApprovedElectors);
router.get('/by-date-range', authenticate, authorize('admin', 'super_admin'), getSubmissionsByDateRange);

router.post('/', authenticate, upload.single('attachment'), createSubmission);
router.get('/mine', authenticate, getMySubmissions);
router.get('/my-stats', authenticate, getMyStats);

router.get('/all', authenticate, authorize('admin', 'super_admin'), getAllSubmissions);
router.put('/:id/approve', authenticate, authorize('admin', 'super_admin'), approveSubmission);
router.put('/:id/reject', authenticate, authorize('admin', 'super_admin'), rejectSubmission);
router.put('/:id', authenticate, authorize('admin', 'super_admin'), updateSubmission);
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), deleteSubmission);

module.exports = router;
