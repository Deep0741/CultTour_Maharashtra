const express = require('express');
const router = express.Router();
const {
getAnalytics,
getUsers,
updateUserStatus,
getAllBookings,
getPendingGuides,
deleteUser,
approveGuide,
rejectGuide,
getAllPayments,
deleteGuide,
getNotifications
} = require("../controllers/adminController");
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

// Dashboard analytics
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Bookings
router.get('/bookings', getAllBookings);

// Guides
router.get('/guides/pending', getPendingGuides);
router.put('/guides/:id/approve', approveGuide);
router.put('/guides/:id/reject', protect, authorize('admin'), rejectGuide);
router.delete('/guides/:id', deleteGuide);


// Payments
router.get('/payments', getAllPayments);

//Notifications
router.get("/notifications",protect,authorize("admin"),getNotifications);


module.exports = router;
