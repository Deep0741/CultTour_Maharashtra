const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },

  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,

  amount: Number,

  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  }

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);