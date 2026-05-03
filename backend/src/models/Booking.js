const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      required: true,
    },
    guideName: {
      type: String,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
    // NEW: For food tours, reference the cuisine
    cuisine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cuisine",
    },
    // NEW: Type of tour
    tourType: {
      type: String,
      enum: ["destination", "food"],
      default: "destination",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    amount: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    // NEW: Meeting point set by guide
    meetingPoint: {
      address: { type: String, default: "" },
      mapLink: { type: String, default: "" },
    },
    // NEW: Tour lifecycle status
    tourStatus: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);