const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  createReview,
  getReviews,
  getMyReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Guide = require('../models/Guide');

// Recalculate all guide ratings from existing reviews
router.post('/recalculate-ratings', async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { reviewType: 'guide' } },
      {
        $group: {
          _id: '$guide',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    let updated = 0;
    for (const stat of stats) {
      await Guide.findByIdAndUpdate(stat._id, {
        rating: Math.round(stat.avgRating * 10) / 10,
        totalReviews: stat.totalReviews
      });
      updated++;
    }

    res.json({ success: true, message: `Recalculated ratings for ${updated} guides`, data: stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, createReview);
router.get('/', getReviews);
router.get('/my-reviews', protect, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;

