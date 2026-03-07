const Joi = require('joi');

// Register validation schema
exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('tourist', 'guide', 'admin').default('tourist'),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional()
});

// Login validation schema
exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('tourist', 'guide', 'admin').optional()
});

// Update profile validation schema
exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  avatar: Joi.string().uri().optional()
});

// Change password validation schema
exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});