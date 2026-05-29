const express = require('express');
const router = express.Router();
const {
  getUsers, getPendingUsers, approveUser, rejectUser,
  suspendUser, activateUser, updateUser, deleteUser, getDashboardStats
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/stats', authenticate, authorize('admin', 'super_admin'), getDashboardStats);
router.get('/', authenticate, authorize('admin', 'super_admin'), getUsers);
router.get('/pending', authenticate, authorize('admin', 'super_admin'), getPendingUsers);
router.put('/:id/approve', authenticate, authorize('admin', 'super_admin'), approveUser);
router.delete('/:id/reject', authenticate, authorize('admin', 'super_admin'), rejectUser);
router.put('/:id/suspend', authenticate, authorize('admin', 'super_admin'), suspendUser);
router.put('/:id/activate', authenticate, authorize('admin', 'super_admin'), activateUser);
router.put('/:id', authenticate, authorize('admin', 'super_admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), deleteUser);

module.exports = router;
