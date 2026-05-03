const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Guide = require("../models/Guide");

const {
  getGuides,
  getGuide,
  getMyProfile,
  updateMyProfile,
  uploadDocuments,
  getEarnings,
  submitGuideVerification,
  approveGuide
} = require("../controllers/guideController");

const { protect, authorize } = require("../middleware/auth");

// Helper: sync guide ratings from Review collection
async function syncGuideRatings() {
  const stats = await Review.aggregate([
    { $match: { reviewType: "guide" } },
    {
      $group: {
        _id: "$guide",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  for (const stat of stats) {
    await Guide.findByIdAndUpdate(stat._id, {
      rating: Math.round(stat.avgRating * 10) / 10,
      totalReviews: stat.totalReviews
    });
  }
}

/* PUBLIC - Get all guides (with live rating sync) */
router.get("/", async (req, res, next) => {
  // Sync ratings from reviews before returning
  try {
    await syncGuideRatings();
  } catch (e) {
    console.error("Rating sync error:", e);
  }
  // Delegate to controller
  getGuides(req, res, next);
});

// Top-rated guides (with live rating sync)
router.get("/top", async (req, res) => {
  try {
    await syncGuideRatings();

    const guides = await Guide.find({ status: "approved" })
      .populate("user", "name email")
      .sort({ rating: -1, totalReviews: -1 })
      .limit(10);
    res.json({ success: true, data: guides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reviews for a specific guide
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ guide: req.params.id, reviewType: "guide" })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* USER ROUTES (IMPORTANT: BEFORE :id) */
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.post("/documents", protect, uploadDocuments);
router.get("/earnings", protect, getEarnings);
router.post("/verify", protect, submitGuideVerification);

/* ADMIN */
router.put("/:id/approve", protect, authorize("admin"), approveGuide);

/* LAST */
router.get("/:id", getGuide);

module.exports = router;