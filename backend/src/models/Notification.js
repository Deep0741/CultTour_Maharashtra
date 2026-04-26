const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["guide", "booking", "system"],
      default: "system",
    },
    // NEW: Track tour type in notifications
    tourType: {
      type: String,
      enum: ["destination", "food"],
      default: "destination",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);