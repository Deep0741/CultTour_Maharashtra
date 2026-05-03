const express = require("express");
const router = express.Router();

const {
  getAnalytics,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAllBookings,
  getPendingGuides,
  getApprovedGuides,
  getAllGuides,
  approveGuide,
  rejectGuide,
  deleteGuide,
  getNotifications,
  clearNotifications,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/auth");

// Apply auth to all admin routes
router.use(protect, authorize("admin"));


// ================= DASHBOARD =================
router.get("/analytics", getAnalytics);


// ================= USERS =================
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);


// ================= BOOKINGS =================
router.get("/bookings", getAllBookings);


// ================= GUIDES =================
router.get("/guides/pending", getPendingGuides);
router.get("/guides/approved", getApprovedGuides);
router.get("/guides", getAllGuides);
router.put("/guides/:id/approve", approveGuide);
router.put("/guides/:id/reject", rejectGuide);
router.delete("/guides/:id", deleteGuide);


// ================= NOTIFICATIONS =================
router.get("/notifications", getNotifications);
router.delete("/notifications", clearNotifications);


module.exports = router;