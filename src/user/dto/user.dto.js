import Joi from 'joi';

export const createUserDto = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).allow('', null).optional(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'Manager', 'Executive', 'Support').optional(),
  status: Joi.boolean().optional()
});

export const updateUserDto = Joi.object({
  name: Joi.string().min(2).max(150).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().max(20).allow('', null).optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('Admin', 'Manager', 'Executive', 'Support').optional(),
  status: Joi.boolean().optional()
});

export const loginDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
