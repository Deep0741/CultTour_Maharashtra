const Destination = require('../models/Destination');
const { uploadToS3, deleteFromS3 } = require('../config/aws');

// @desc    Get all destinations
// @route   GET /api/v1/destinations
// @access  Public
exports.getDestinations = async (req, res, next) => {
  try {
    const { category, city, search, sort, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) query.category = category;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Sort options
    let sortOption = {};
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popular') sortOption = { visitCount: -1 };
    else sortOption = { createdAt: -1 };

    // Pagination
    const skip = (page - 1) * limit;

    const destinations = await Destination.find(query)
      .populate('localCuisines', 'name images')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Destination.countDocuments(query);

    res.status(200).json({
      success: true,
      count: destinations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination
// @route   GET /api/v1/destinations/:id
// @access  Public
exports.getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('localCuisines')
      .populate('nearbyAttractions', 'name images location');

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Increment visit count
    destination.visitCount += 1;
    await destination.save();

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create destination
// @route   POST /api/v1/destinations
// @access  Private/Admin
exports.createDestination = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    // Handle image uploads if files are present
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const url = await uploadToS3(file, 'destinations');
        imageUrls.push({ url });
      }
      req.body.images = imageUrls;
    }

    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination
// @route   PUT /api/v1/destinations/:id
// @access  Private/Admin
exports.updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const url = await uploadToS3(file, 'destinations');
        imageUrls.push({ url });
      }
      req.body.images = [...(destination.images || []), ...imageUrls];
    }

    destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination
// @route   DELETE /api/v1/destinations/:id
// @access  Private/Admin
exports.deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Soft delete
    destination.isActive = false;
    await destination.save();

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get destination categories
// @route   GET /api/v1/destinations/categories/list
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Destination.distinct('category');

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
