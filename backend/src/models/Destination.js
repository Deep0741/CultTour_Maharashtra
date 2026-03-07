const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['fort', 'heritage', 'festival', 'cuisine', 'temple', 'beach', 'hill_station', 'wildlife']
  },
  location: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      default: 'Maharashtra'
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    address: String
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String
  }],
  history: {
    type: String,
    maxlength: [3000, 'History cannot exceed 3000 characters']
  },
  bestTimeToVisit: {
    type: String
  },
  entryFee: {
    indian: {
      type: Number,
      default: 0
    },
    foreign: {
      type: Number,
      default: 0
    }
  },
  timings: {
    opening: String,
    closing: String
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
  visitCount: {
    type: Number,
    default: 0
  },
  localCuisines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cuisine'
  }],
  nearbyAttractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],
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
destinationSchema.index({ name: 1 });
destinationSchema.index({ category: 1 });
destinationSchema.index({ 'location.city': 1 });
destinationSchema.index({ rating: -1 });
destinationSchema.index({ visitCount: -1 });
destinationSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });

module.exports = mongoose.model('Destination', destinationSchema);
