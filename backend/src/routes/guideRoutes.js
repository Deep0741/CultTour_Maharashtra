const express = require("express");
const router = express.Router();

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

/* PUBLIC */
router.get("/", getGuides);

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