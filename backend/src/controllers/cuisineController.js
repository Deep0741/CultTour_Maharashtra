const Cuisine = require('../models/Cuisine');
const { uploadToS3 } = require('../config/aws');

// @desc    Get all cuisines
// @route   GET /api/v1/cuisines
// @access  Public
exports.getCuisines = async (req, res, next) => {
  try {
    const { category, type, region, spiceLevel, search, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (type) query.type = type;
    if (region) query.region = new RegExp(region, 'i');
    if (spiceLevel) query.spiceLevel = spiceLevel;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;

    const cuisines = await Cuisine.find(query)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Cuisine.countDocuments(query);

    res.status(200).json({
      success: true,
      count: cuisines.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: cuisines
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cuisine
// @route   GET /api/v1/cuisines/:id
// @access  Public
exports.getCuisine = async (req, res, next) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id);

    if (!cuisine) {
      return res.status(404).json({
        success: false,
        message: 'Cuisine not found'
      });
    }

    res.status(200).json({
      success: true,
      data: cuisine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create cuisine
// @route   POST /api/v1/cuisines
// @access  Private/Admin
exports.createCuisine = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const url = await uploadToS3(file, 'cuisines');
        imageUrls.push({ url });
      }
      req.body.images = imageUrls;
    }

    const cuisine = await Cuisine.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Cuisine created successfully',
      data: cuisine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cuisine
// @route   PUT /api/v1/cuisines/:id
// @access  Private/Admin
exports.updateCuisine = async (req, res, next) => {
  try {
    let cuisine = await Cuisine.findById(req.params.id);

    if (!cuisine) {
      return res.status(404).json({
        success: false,
        message: 'Cuisine not found'
      });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const url = await uploadToS3(file, 'cuisines');
        imageUrls.push({ url });
      }
      req.body.images = [...(cuisine.images || []), ...imageUrls];
    }

    cuisine = await Cuisine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Cuisine updated successfully',
      data: cuisine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cuisine
// @route   DELETE /api/v1/cuisines/:id
// @access  Private/Admin
exports.deleteCuisine = async (req, res, next) => {
  try {
    const cuisine = await Cuisine.findById(req.params.id);

    if (!cuisine) {
      return res.status(404).json({
        success: false,
        message: 'Cuisine not found'
      });
    }

    // Soft delete
    cuisine.isActive = false;
    await cuisine.save();

    res.status(200).json({
      success: true,
      message: 'Cuisine deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
