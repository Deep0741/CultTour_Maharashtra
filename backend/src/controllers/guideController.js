const Guide = require('../models/Guide');
const User = require('../models/User');
const { uploadToS3 } = require('../config/aws');
const Notification = require("../models/Notification");


// =============================
// GET ALL GUIDES (FIXED)
// =============================
exports.getGuides = async (req, res, next) => {
  try {

    // ✅ TEMP: remove filter so data shows
    const guides = await Guide.find()
      .populate("user", "name email phone avatar");

    // ✅ FORMAT FOR FRONTEND
    const formattedGuides = guides.map(g => ({
      _id: g._id,
      name: g.user?.name || "Guide",
      bio: g.bio || "No description available",
      pricePerTour: g.pricePerDay || 1000
    }));

    res.status(200).json({
      success: true,
      data: formattedGuides
    });

  } catch (error) {
    next(error);
  }
};



// =============================
// GET SINGLE GUIDE
// =============================
exports.getGuide = async (req, res, next) => {
  try {

    const guide = await Guide.findById(req.params.id)
      .populate("user", "name email phone avatar");

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found"
      });
    }

    res.json({
      success: true,
      data: guide
    });

  } catch (error) {
    next(error);
  }
};



// =============================
// GET MY PROFILE
// =============================
exports.getMyProfile = async (req, res, next) => {
  try {

    const guide = await Guide.findOne({ user: req.user.id })
      .populate("user", "name email phone avatar");

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found"
      });
    }

    res.json({
      success: true,
      data: guide
    });

  } catch (error) {
    next(error);
  }
};



// =============================
// UPDATE PROFILE
// =============================
exports.updateMyProfile = async (req, res, next) => {
  try {

    const guide = await Guide.findOne({ user: req.user.id });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found"
      });
    }

    const {
      bio,
      languages,
      specializations,
      experience,
      pricePerDay,
      availability,
      locations
    } = req.body;

    if (bio) guide.bio = bio;
    if (languages) guide.languages = languages;
    if (specializations) guide.specializations = specializations;
    if (experience !== undefined) guide.experience = experience;
    if (pricePerDay !== undefined) guide.pricePerDay = pricePerDay;
    if (availability !== undefined) guide.availability = availability;
    if (locations) guide.locations = locations;

    await guide.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: guide
    });

  } catch (error) {
    next(error);
  }
};



// =============================
// UPLOAD DOCUMENTS
// =============================
exports.uploadDocuments = async (req, res, next) => {
  try {

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload documents"
      });
    }

    const guide = await Guide.findOne({ user: req.user.id });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found"
      });
    }

    const documents = [];

    for (const file of req.files) {
      const url = await uploadToS3(file, "guide-documents");

      documents.push({
        type: req.body.type || "certificate",
        url
      });
    }

    guide.documents.push(...documents);
    await guide.save();

    res.json({
      success: true,
      message: "Documents uploaded successfully",
      data: guide
    });

  } catch (error) {
    next(error);
  }
};



// =============================
// GET EARNINGS
// =============================
exports.getEarnings = async (req, res, next) => {
  try {

    const guide = await Guide.findOne({ user: req.user.id });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found"
      });
    }

    res.json({
      success: true,
      data: {
        totalEarnings: guide.totalEarnings,
        totalBookings: guide.totalBookings,
        rating: guide.rating,
        totalReviews: guide.totalReviews
      }
    });

  } catch (error) {
    next(error);
  }
};



// =============================
// SUBMIT VERIFICATION
// =============================
exports.submitGuideVerification = async (req, res, next) => {
  try {

    const existingGuide = await Guide.findOne({ user: req.user.id });

    if (existingGuide) {
      return res.status(400).json({
        success: false,
        message: "Verification already submitted"
      });
    }

    const guide = await Guide.create({
      user: req.user.id,
      licenseNumber: req.body.licenseNumber,
      authority: req.body.authority,
      issueDate: req.body.issueDate,
      expiryDate: req.body.expiryDate,

      languages: [],
      specializations: [],
      experience: 0,
      locations: [],

      pricePerDay: 1000, // ✅ default so UI works
      availability: true,
      rating: 0,
      totalReviews: 0,
      totalBookings: 0,
      totalEarnings: 0,

      status: "pending"
    });

    // Notify admin
    await Notification.create({
      title: "New Guide Verification",
      message: "A new guide submitted license verification.",
      type: "guide"
    });

    res.json({
      success: true,
      message: "Verification submitted successfully",
      data: guide
    });

  } catch (error) {
    next(error);
  }
};



// =============================
// APPROVE GUIDE
// =============================
exports.approveGuide = async (req, res, next) => {
  try {

    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found"
      });
    }

    await User.findByIdAndUpdate(
      guide.user,
      { isVerified: true }
    );

    res.json({
      success: true,
      message: "Guide approved successfully",
      data: guide
    });

  } catch (error) {
    next(error);
  }
};