import Joi from 'joi';

export const createServiceDto = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().allow('', null).optional(),
  description: Joi.string().allow('', null).optional(),
  unit_price: Joi.number().min(0).required(),
  tax_percent: Joi.number().min(0).max(100).optional(),
  currency: Joi.string().optional(),
  is_active: Joi.boolean().optional(),
  line_items: Joi.array().items(Joi.object({
    item_name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    qty: Joi.number().min(0).optional(),
    unit_price: Joi.number().min(0).required(),
    tax_percent: Joi.number().min(0).max(100).optional()
  })).optional(),
  action_plans: Joi.array().items(Joi.object({
    id: Joi.number().optional(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    offset_days: Joi.number().min(0).optional(),
    priority: Joi.string().optional()
  })).optional()
});

export const updateServiceDto = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string().allow('', null).optional(),
  description: Joi.string().allow('', null).optional(),
  unit_price: Joi.number().min(0).optional(),
  tax_percent: Joi.number().min(0).max(100).optional(),
  currency: Joi.string().optional(),
  is_active: Joi.boolean().optional(),
  line_items: Joi.array().items(Joi.object({
    id: Joi.number().optional(),
    item_name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    qty: Joi.number().min(0).optional(),
    unit_price: Joi.number().min(0).required(),
    tax_percent: Joi.number().min(0).max(100).optional()
  })).optional(),
  action_plans: Joi.array().items(Joi.object({
    id: Joi.number().optional(),
    title: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    offset_days: Joi.number().min(0).optional(),
    priority: Joi.string().optional()
  })).optional()
});
