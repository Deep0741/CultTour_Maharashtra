const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewType: {
    type: String,
    enum: ['destination', 'guide', 'cuisine'],
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide'
  },
  cuisine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cuisine'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ user: 1 });
reviewSchema.index({ reviewType: 1 });
reviewSchema.index({ destination: 1 });
reviewSchema.index({ guide: 1 });
reviewSchema.index({ cuisine: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

// One review per user per booking (not per guide — allows reviewing same guide for different bookings)
reviewSchema.index({ user: 1, booking: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
