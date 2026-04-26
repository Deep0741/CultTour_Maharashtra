const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Guide = require("../models/Guide");
const Notification = require("../models/Notification");

// ✅ CREATE BOOKING (supports destination + food tours)
router.post("/create", async (req, res) => {
  try {
    const { userId, guideId, destinationId, cuisineId, date, amount, tourType } = req.body;

    if (!userId || !guideId) {
      return res.status(400).json({
        message: "Missing required fields: userId, guideId",
      });
    }

    // For destination tours, destinationId is required
    if (tourType !== "food" && !destinationId) {
      return res.status(400).json({
        message: "Missing required field: destinationId for destination tour",
      });
    }

    // Fetch guide + user name
    const guideData = await Guide.findById(guideId).populate("user");
    if (!guideData) {
      return res.status(404).json({ message: "Guide not found" });
    }

    const bookingData = {
      tourist: userId,
      guide: guideId,
      guideName: guideData.user?.name || "Guide",
      date: date ? new Date(date) : new Date(),
      amount: amount || 0,
      status: "pending",
      paymentStatus: "pending",
      tourType: tourType || "destination",
      tourStatus: "not-started",
    };

    // Set reference based on tour type
    if (tourType === "food" && cuisineId) {
      bookingData.cuisine = cuisineId;
    } else if (destinationId) {
      bookingData.destination = destinationId;
    }

    const booking = await Booking.create(bookingData);

    const tourLabel = tourType === "food" ? "food tour" : "destination tour";
    await Notification.create({
      title: "New Booking Request",
      message: `A tourist has booked you for a ${tourLabel}.`,
      type: "booking",
      tourType: tourType || "destination",
      guideId: guideId,
      bookingId: booking._id,
    });

    res.json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
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


// ✅ SET MEETING POINT (Guide action after accepting)
router.post("/set-meeting-point", async (req, res) => {
  try {
    const { bookingId, address, mapLink } = req.body;

    if (!bookingId || !address) {
      return res.status(400).json({ message: "bookingId and address are required." });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "accepted") {
      return res.status(400).json({ message: "Booking must be accepted before setting meeting point." });
    }

    booking.meetingPoint = {
      address: address,
      mapLink: mapLink || "",
    };
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ START TOUR (Guide action)
router.post("/start-tour", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "accepted") {
      return res.status(400).json({ message: "Booking must be accepted to start tour." });
    }

    booking.tourStatus = "in-progress";
    await booking.save();

    res.json({ success: true, message: "Tour started", data: booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ END TOUR (Tourist action)
router.post("/end-tour", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.tourStatus !== "in-progress") {
      return res.status(400).json({ message: "Tour must be in progress to end it." });
    }

    booking.tourStatus = "completed";
    booking.status = "completed";
    await booking.save();

    res.json({ success: true, message: "Tour completed", data: booking });
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
      .populate("cuisine", "name image region")
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
      .populate({
        path: "guide",
        populate: {
          path: "user",
          select: "name email phone"
        }
      })
      .populate("destination", "name location image")
      .populate("cuisine", "name image region")
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
          { path: "cuisine", select: "name" },
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
      .populate({
        path: "guide",
        populate: {
          path: "user",
          select: "name email phone"
        }
      })
      .populate("destination", "name location image")
      .populate("cuisine", "name image region");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;