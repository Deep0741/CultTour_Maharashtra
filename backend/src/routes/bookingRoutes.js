const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Guide = require("../models/Guide");
const Notification = require("../models/Notification");


// ✅ CREATE BOOKING
router.post("/create", async (req, res) => {
  try {
    const { userId, guideId, destinationId, date, amount } = req.body;

    if (!userId || !guideId || !destinationId) {
      return res.status(400).json({ message: "Missing required fields: userId, guideId, destinationId" });
    }

    const booking = await Booking.create({
      tourist: userId,
      guide: guideId,
      destination: destinationId,
      date: date ? new Date(date) : new Date(),
      amount: amount || 0,
      status: "pending",
      paymentStatus: "pending",
    });

    // Notify the guide about the new booking request
    await Notification.create({
      title: "New Booking Request",
      message: `A tourist has booked you for a destination tour. Check your dashboard to accept or reject.`,
      type: "booking",
      guideId: guideId,
      bookingId: booking._id,
    });

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ACCEPT / REJECT (Guide action)
router.post("/update-status", async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'accepted' or 'rejected'." });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET BOOKINGS FOR GUIDE
router.get("/guide/:guideId", async (req, res) => {
  try {
    const bookings = await Booking.find({ guide: req.params.guideId })
      .populate("tourist", "name email phone")
      .populate("destination", "name location image")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET BOOKINGS FOR TOURIST
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ tourist: req.params.userId })
      .populate("guide", "bio pricePerDay")
      .populate("destination", "name location image")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET NOTIFICATIONS FOR A GUIDE
router.get("/notifications/guide/:guideId", async (req, res) => {
  try {
    const notifications = await Notification.find({ guideId: req.params.guideId })
      .populate({
        path: "bookingId",
        populate: [
          { path: "tourist", select: "name email" },
          { path: "destination", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET SINGLE BOOKING
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("tourist", "name email phone")
      .populate("guide")
      .populate("destination", "name location image");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;