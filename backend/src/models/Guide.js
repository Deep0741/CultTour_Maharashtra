const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  languages: [{
    type: String,
    trim: true
  }],
  specializations: [{
    type: String,
    enum: ['heritage', 'cuisine', 'adventure', 'photography', 'trekking', 'cultural'],
    trim: true
  }],
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    default: 0
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price cannot be negative']
  },
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  documents: [{
    type: {
      type: String,
      enum: ['id_proof', 'certificate', 'license']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  locations: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes
guideSchema.index({ user: 1 });
guideSchema.index({ rating: -1 });
guideSchema.index({ pricePerDay: 1 });
guideSchema.index({ isApproved: 1 });

module.exports = mongoose.model('Guide', guideSchema);
