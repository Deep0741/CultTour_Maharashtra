const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getUsers,
  updateUserStatus,
  getAllBookings,
  getPendingGuides,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/bookings', getAllBookings);
router.get('/guides/pending', getPendingGuides);

module.exports = router;
