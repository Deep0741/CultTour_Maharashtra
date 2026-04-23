const express = require("express");
const router = express.Router();
//const Razorpay = require("razorpay");
//const crypto = require("crypto");

const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET
// });

// CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {
    res.json({
      id: "mock_order_123",
      amount: 1000
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VERIFY
router.post("/verify", async (req, res) => {
  try {
    const { bookingId } = req.body;

    // mark booking as confirmed
    await Booking.findByIdAndUpdate(bookingId, {
      status: "CONFIRMED"
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;