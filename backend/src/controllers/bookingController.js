const Booking = require('../models/Booking');
const Guide = require('../models/Guide');
const Payment = require('../models/Payment');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private/Tourist
exports.createBooking = async (req, res, next) => {
  try {
    const { guide, destination, startDate, endDate, numberOfPeople, specialRequests } = req.body;

    // Get guide details
    const guideData = await Guide.findById(guide).populate('user');

    if (!guideData) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    if (!guideData.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Guide is not approved yet'
      });
    }

    if (!guideData.availability) {
      return res.status(400).json({
        success: false,
        message: 'Guide is not available'
      });
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Calculate amounts
    const totalAmount = guideData.pricePerDay * numberOfDays * numberOfPeople;
    const platformCommission = (totalAmount * parseInt(process.env.PLATFORM_COMMISSION)) / 100;
    const guideEarnings = totalAmount - platformCommission;

    // Create booking
    const booking = await Booking.create({
      tourist: req.user.id,
      guide,
      destination,
      startDate,
      endDate,
      numberOfDays,
      numberOfPeople,
      totalAmount,
      platformCommission,
      guideEarnings,
      specialRequests
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `booking_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        touristId: req.user.id.toString()
      }
    });

    // Create payment record
    await Payment.create({
      booking: booking._id,
      user: req.user.id,
      amount: totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
        razorpayOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/v1/bookings/verify-payment
// @access  Private/Tourist
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update payment
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'success',
        transactionDate: new Date()
      }
    );

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'completed',
        paymentId: razorpayPaymentId
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/v1/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { tourist: req.user.id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('guide', 'user pricePerDay rating')
      .populate('destination', 'name images location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get guide bookings
// @route   GET /api/v1/bookings/guide-bookings
// @access  Private/Guide
exports.getGuideBookings = async (req, res, next) => {
  try {
    const guide = await Guide.findOne({ user: req.user.id });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const query = { guide: guide._id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('tourist', 'name email phone')
      .populate('destination', 'name images location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id/status
// @access  Private/Guide
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify guide ownership
    const guide = await Guide.findOne({ user: req.user.id });
    if (booking.guide.toString() !== guide._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.status = status;

    if (status === 'confirmed') {
      // Update guide stats
      guide.totalBookings += 1;
      await guide.save();
    }

    if (status === 'completed') {
      // Update guide earnings
      guide.totalEarnings += booking.guideEarnings;
      await guide.save();
    }

    if (status === 'rejected' || status === 'cancelled') {
      booking.cancellationReason = cancellationReason;
      booking.cancelledBy = req.user.id;
      booking.cancelledAt = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('tourist', 'name email phone')
      .populate('guide', 'user pricePerDay rating')
      .populate('destination');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
