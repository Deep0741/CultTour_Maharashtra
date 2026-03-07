const express = require('express');
const router = express.Router();
const {
  createBooking,
  verifyPayment,
  getMyBookings,
  getGuideBookings,
  updateBookingStatus,
  getBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createBookingSchema, updateBookingStatusSchema } = require('../validators/bookingValidator');

router.post('/', protect, authorize('tourist'), validate(createBookingSchema), createBooking);
router.post('/verify-payment', protect, authorize('tourist'), verifyPayment);
router.get('/my-bookings', protect, authorize('tourist'), getMyBookings);
router.get('/guide-bookings', protect, authorize('guide'), getGuideBookings);
router.put('/:id/status', protect, authorize('guide'), validate(updateBookingStatusSchema), updateBookingStatus);
router.get('/:id', protect, getBooking);

module.exports = router;
