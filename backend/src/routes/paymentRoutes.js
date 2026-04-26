const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Booking = require("../models/Booking");
const sendEmail = require("../utils/mailer");

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
    ).populate({
      path: "guide",
      populate: { path: "user", select: "name email" }
    });

    // Send email notification to the guide if payment was successful
    if (booking && booking.guide?.user?.email) {
      await sendEmail({
        to: booking.guide.user.email,
        subject: "Payment Received! 💰",
        text: `Hello ${booking.guide.user.name},\n\nThe tourist has successfully completed the payment for your tour booking. You are all set to provide them an amazing experience!\n\nThank you,\nCulTour Maharashtra Team`,
        html: `<h3>Hello ${booking.guide.user.name},</h3><p>The tourist has successfully completed the payment for your tour booking.</p><p>You are all set to provide them an amazing experience!</p><br><p>Thank you,<br>CulTour Maharashtra Team</p>`
      });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;