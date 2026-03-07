import Joi from 'joi';

const createLeadDto = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  email: Joi.string().email().allow('', null).optional(),
  phone: Joi.string().max(20).allow('', null).optional(),
  company: Joi.string().max(150).allow('', null).optional(),
  source: Joi.string().max(100).allow('', null).optional(),
  status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost').optional(),
  assigned_to: Joi.number().allow(null).optional()
});

const updateLeadDto = Joi.object({
  name: Joi.string().min(2).max(150).optional(),
  email: Joi.string().email().allow('', null).optional(),
  phone: Joi.string().max(20).allow('', null).optional(),
  company: Joi.string().max(150).allow('', null).optional(),
  source: Joi.string().max(100).allow('', null).optional(),
  status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost').optional(),
  assigned_to: Joi.number().allow(null).optional()
});

export { createLeadDto, updateLeadDto };
