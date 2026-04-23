const User = require("../models/User");
const Booking = require("../models/Booking");
const Destination = require("../models/Destination");
const Guide = require("../models/Guide");
const Notification = require("../models/Notification");


// ===================== DASHBOARD =====================
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "tourist" });
    const totalGuides = await Guide.countDocuments({ status: "approved" });
    const pendingGuides = await Guide.countDocuments({ status: "pending" });
    const totalBookings = await Booking.countDocuments();
    const totalDestinations = await Destination.countDocuments({ isActive: true });

    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        users: totalUsers,
        guides: totalGuides,
        pendingGuides,
        bookings: totalBookings,
        destinations: totalDestinations,
        revenue: revenueData[0]?.totalRevenue || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ===================== USERS =====================
exports.getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;

    const query = {};
    if (role) query.role = role;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};


// ===================== DELETE USER =====================
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


// ===================== UPDATE USER STATUS =====================
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


// ===================== ALL BOOKINGS =====================
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate("tourist", "name email")
      .populate({
        path: "guide",
        populate: { path: "user", select: "name email" },
      })
      .populate("destination", "name location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};


// ===================== PENDING GUIDES =====================
exports.getPendingGuides = async (req, res, next) => {
  try {
    const guides = await Guide.find({ status: "pending" })
      .populate("user", "name email phone avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: guides.length,
      data: guides,
    });
  } catch (error) {
    next(error);
  }
};


// ===================== ALL APPROVED GUIDES =====================
exports.getApprovedGuides = async (req, res) => {
  try {
    const guides = await Guide.find({ status: "approved" })
      .populate("user", "name email phone avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: guides,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===================== ALL GUIDES (any status) =====================
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find()
      .populate("user", "name email phone avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: guides,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===================== APPROVE GUIDE =====================
exports.approveGuide = async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }

    await User.findByIdAndUpdate(guide.user, { isVerified: true });

    // Remove any pending notifications for this guide
    await Notification.deleteMany({ guideId: guide._id, type: "guide" });

    res.json({ success: true, message: "Guide approved successfully", data: guide });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===================== REJECT GUIDE =====================
exports.rejectGuide = async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }

    res.json({ success: true, message: "Guide rejected", data: guide });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===================== DELETE GUIDE =====================
exports.deleteGuide = async (req, res, next) => {
  try {
    await Guide.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Guide removed successfully",
    });
  } catch (error) {
    next(error);
  }
};


// ===================== NOTIFICATIONS =====================
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===================== CLEAR NOTIFICATIONS =====================
exports.clearNotifications = async (req, res) => {
  await Notification.deleteMany({});
  res.json({ success: true, message: "All notifications cleared" });
};