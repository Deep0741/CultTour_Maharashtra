const Guide = require('../models/Guide');
const User = require('../models/User');
const { uploadToS3 } = require('../config/aws');

// @desc    Get all guides
// @route   GET /api/v1/guides
// @access  Public
exports.getGuides = async (req, res, next) => {
  try {
    const { specialization, minPrice, maxPrice, rating, city, page = 1, limit = 10 } = req.query;

    const query = { isApproved: true, availability: true };

    if (specialization) query.specializations = specialization;
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = parseInt(minPrice);
      if (maxPrice) query.pricePerDay.$lte = parseInt(maxPrice);
    }
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (city) query.locations = new RegExp(city, 'i');

    const skip = (page - 1) * limit;

    const guides = await Guide.find(query)
      .populate('user', 'name email phone avatar')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Guide.countDocuments(query);

    res.status(200).json({
      success: true,
      count: guides.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: guides
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single guide
// @route   GET /api/v1/guides/:id
// @access  Public
exports.getGuide = async (req, res, next) => {
  try {
    const guide = await Guide.findById(req.params.id)
      .populate('user', 'name email phone avatar');

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    res.status(200).json({
      success: true,
      data: guide
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my guide profile
// @route   GET /api/v1/guides/me
// @access  Private/Guide
exports.getMyProfile = async (req, res, next) => {
  try {
    const guide = await Guide.findOne({ user: req.user.id })
      .populate('user', 'name email phone avatar');

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: guide
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update guide profile
// @route   PUT /api/v1/guides/me
// @access  Private/Guide
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { bio, languages, specializations, experience, pricePerDay, availability, locations } = req.body;

    let guide = await Guide.findOne({ user: req.user.id });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found'
      });
    }

    // Update fields
    if (bio) guide.bio = bio;
    if (languages) guide.languages = languages;
    if (specializations) guide.specializations = specializations;
    if (experience !== undefined) guide.experience = experience;
    if (pricePerDay !== undefined) guide.pricePerDay = pricePerDay;
    if (availability !== undefined) guide.availability = availability;
    if (locations) guide.locations = locations;

    await guide.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: guide
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload guide documents
// @route   POST /api/v1/guides/documents
// @access  Private/Guide
exports.uploadDocuments = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload documents'
      });
    }

    const guide = await Guide.findOne({ user: req.user.id });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found'
      });
    }

    const documents = [];
    for (const file of req.files) {
      const url = await uploadToS3(file, 'guide-documents');
      documents.push({
        type: req.body.type || 'certificate',
        url
      });
    }

    guide.documents.push(...documents);
    await guide.save();

    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: guide
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get guide earnings
// @route   GET /api/v1/guides/earnings
// @access  Private/Guide
exports.getEarnings = async (req, res, next) => {
  try {
    const guide = await Guide.findOne({ user: req.user.id });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found'
      });
    }

    res.status(200).json({
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

// @desc    Approve guide (Admin only)
// @route   PUT /api/v1/guides/:id/approve
// @access  Private/Admin
exports.approveGuide = async (req, res, next) => {
  try {
    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Guide approved successfully',
      data: guide
    });
  } catch (error) {
    next(error);
  }
};
