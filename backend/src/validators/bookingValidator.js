const Joi = require('joi');

// Create booking validation schema
exports.createBookingSchema = Joi.object({
  guide: Joi.string().hex().length(24).required(),
  destination: Joi.string().hex().length(24).required(),
  startDate: Joi.date().min('now').required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  numberOfPeople: Joi.number().integer().min(1).required(),
  specialRequests: Joi.string().max(500).optional()
});

// Update booking status validation schema
exports.updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid('confirmed', 'rejected', 'completed', 'cancelled').required(),
  cancellationReason: Joi.string().when('status', {
    is: Joi.string().valid('rejected', 'cancelled'),
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});
