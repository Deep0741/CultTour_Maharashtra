const mongoose = require('mongoose');

const cuisineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cuisine name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage']
  },
  type: {
    type: String,
    enum: ['veg', 'non-veg', 'vegan'],
    required: true
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String
  }],
  ingredients: [{
    type: String,
    trim: true
  }],
  preparationTime: {
    type: Number,
    min: 0
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'very_hot'],
    default: 'medium'
  },
  popularIn: [{
    type: String,
    trim: true
  }],
  averagePrice: {
    type: Number,
    min: 0
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
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
cuisineSchema.index({ name: 1 });
cuisineSchema.index({ category: 1 });
cuisineSchema.index({ type: 1 });
cuisineSchema.index({ region: 1 });
cuisineSchema.index({ rating: -1 });

module.exports = mongoose.model('Cuisine', cuisineSchema);
