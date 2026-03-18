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

router.get("/", getGuides);
router.get("/:id", getGuide);

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

router.post("/documents", protect, uploadDocuments);
router.get("/earnings", protect, getEarnings);

/* IMPORTANT ROUTE */
router.post("/verify", protect, submitGuideVerification);

/* ADMIN */
router.put("/:id/approve", protect, authorize("admin"), approveGuide);

module.exports = router;