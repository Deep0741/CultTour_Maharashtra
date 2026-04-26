const Review = require('../models/Review');
const Destination = require('../models/Destination');
const Guide = require('../models/Guide');
const Cuisine = require('../models/Cuisine');
const Booking = require('../models/Booking');

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { reviewType, destination, guide, cuisine, booking, rating, comment, images } = req.body;

    // Validate review type and corresponding ID
    if (reviewType === 'destination' && !destination) {
      return res.status(400).json({
        success: false,
        message: 'Destination ID is required'
      });
    }

    if (reviewType === 'guide' && !guide) {
      return res.status(400).json({
        success: false,
        message: 'Guide ID is required'
      });
    }

    if (reviewType === 'cuisine' && !cuisine) {
      return res.status(400).json({
        success: false,
        message: 'Cuisine ID is required'
      });
    }

    // For guide reviews, verify booking
    if (reviewType === 'guide' && booking) {
      const bookingData = await Booking.findById(booking);
      if (!bookingData || bookingData.tourist.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only review guides you have booked'
        });
      }
      if (bookingData.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'You can only review completed bookings'
        });
      }
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      reviewType,
      destination,
      guide,
      cuisine,
      booking,
      rating,
      comment,
      images,
      isVerified: booking ? true : false
    });

    // Update average rating — use the correct ID for the review type
    const targetId = reviewType === 'guide' ? guide : reviewType === 'destination' ? destination : cuisine;
    await updateAverageRating(reviewType, targetId);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update average rating
const updateAverageRating = async (type, id) => {
  if (!id) return;

  const mongoose = require('mongoose');
  let Model;
  let field;

  if (type === 'destination') {
    Model = Destination;
    field = 'destination';
  } else if (type === 'guide') {
    Model = Guide;
    field = 'guide';
  } else if (type === 'cuisine') {
    Model = Cuisine;
    field = 'cuisine';
  }

  // Convert string id to ObjectId for aggregation
  const objectId = new mongoose.Types.ObjectId(id);

  const stats = await Review.aggregate([
    { $match: { [field]: objectId, reviewType: type } },
    {
      $group: {
        _id: `$${field}`,
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Model.findByIdAndUpdate(id, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  }
};

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const { reviewType, destination, guide, cuisine, page = 1, limit = 10 } = req.query;

    const query = {};

    if (reviewType) query.reviewType = reviewType;
    if (destination) query.destination = destination;
    if (guide) query.guide = guide;
    if (cuisine) query.cuisine = cuisine;

    const skip = (page - 1) * limit;

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my reviews
// @route   GET /api/v1/reviews/my-reviews
// @access  Private
exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('destination', 'name images')
      .populate('guide', 'user')
      .populate('cuisine', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, comment, images } = req.body;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment, images },
      { new: true, runValidators: true }
    );

    // Update average rating
    const field = review.reviewType === 'destination' ? review.destination :
                  review.reviewType === 'guide' ? review.guide : review.cuisine;
    await updateAverageRating(review.reviewType, field);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const field = review.reviewType === 'destination' ? review.destination :
                  review.reviewType === 'guide' ? review.guide : review.cuisine;

    await review.deleteOne();

    // Update average rating
    await updateAverageRating(review.reviewType, field);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
