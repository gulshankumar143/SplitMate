import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required()
});

export const googleSchema = Joi.object({
  token: Joi.string().required()
});

export const forgotSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required()
});

export const expenseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  category: Joi.string().default('Others'),
  amount: Joi.number().required(),
  currency: Joi.string().default('INR'),
  date: Joi.date().required(),
  location: Joi.string().allow(''),
  notes: Joi.string().allow(''),
  sharedWith: Joi.array().items(Joi.string().optional()),
  splitType: Joi.string().valid('equal', 'exact', 'percentage', 'shares').default('equal'),
  splitDetails: Joi.array().items(Joi.object()),
  group: Joi.string().optional(),
  recurring: Joi.object({ frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly', 'none').default('none'), nextDate: Joi.date().optional() }).optional(),
  paymentMethod: Joi.string().default('UPI'),
  tags: Joi.array().items(Joi.string()).optional()
});
