const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Booking = require("../models/Booking");

// 🔐 RAZORPAY INSTANCE
const razorpay = new Razorpay({
  key_id: "rzp_test_Sgvei3dA2INUG5",
  key_secret: "2k1QjfHTQ1vIbaBvpLStcDT0",
});

// ✅ CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `booking_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ VERIFY PAYMENT (SIMPLIFIED DEMO)
router.post("/verify", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "paid",
      },
      { new: true }
    );

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;