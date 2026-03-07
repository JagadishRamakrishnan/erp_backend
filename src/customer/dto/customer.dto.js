import Joi from 'joi';

const createCustomerDto = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  email: Joi.string().email().allow('', null).optional(),
  phone: Joi.string().max(20).allow('', null).optional(),
  company: Joi.string().max(150).allow('', null).optional(),
  address: Joi.string().allow('', null).optional(),
  city: Joi.string().max(100).allow('', null).optional(),
  state: Joi.string().max(100).allow('', null).optional(),
  country: Joi.string().max(100).allow('', null).optional(),
  created_from_lead: Joi.number().allow(null).optional()
});

const updateCustomerDto = Joi.object({
  name: Joi.string().min(2).max(150).optional(),
  email: Joi.string().email().allow('', null).optional(),
  phone: Joi.string().max(20).allow('', null).optional(),
  company: Joi.string().max(150).allow('', null).optional(),
  address: Joi.string().allow('', null).optional(),
  city: Joi.string().max(100).allow('', null).optional(),
  state: Joi.string().max(100).allow('', null).optional(),
  country: Joi.string().max(100).allow('', null).optional()
});

export { createCustomerDto, updateCustomerDto };
