import Joi from 'joi';

const createDealDto = Joi.object({
  deal_name: Joi.string().min(2).max(150).required(),
  customer_id: Joi.number().allow(null).optional(),
  lead_id: Joi.number().allow(null).optional(),
  value: Joi.number().allow(null).optional(),
  stage: Joi.string().valid('Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost').optional(),
  probability: Joi.number().min(0).max(100).allow(null).optional(),
  expected_close_date: Joi.date().allow(null).optional(),
  assigned_to: Joi.number().allow(null).optional()
});

const updateDealDto = Joi.object({
  deal_name: Joi.string().min(2).max(150).optional(),
  customer_id: Joi.number().allow(null).optional(),
  lead_id: Joi.number().allow(null).optional(),
  value: Joi.number().allow(null).optional(),
  stage: Joi.string().valid('Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost').optional(),
  probability: Joi.number().min(0).max(100).allow(null).optional(),
  expected_close_date: Joi.date().allow(null).optional(),
  assigned_to: Joi.number().allow(null).optional()
});

export { createDealDto, updateDealDto };
