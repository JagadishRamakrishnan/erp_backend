import Joi from 'joi';

const createInvoiceDto = Joi.object({
  customer_id: Joi.number().required(),
  deal_id: Joi.number().allow(null).optional(),
  quotation_id: Joi.number().allow(null).optional(),
  total_amount: Joi.number().min(0).required(),
  paid_amount: Joi.number().min(0).allow(null).optional(),
  status: Joi.string().valid('Pending', 'Partial', 'Paid').optional(),
  is_recurring: Joi.boolean().optional(),
  recurring_interval: Joi.string().valid('Monthly', 'Quarterly', 'Yearly').allow(null).optional(),
  items: Joi.array().items(Joi.object({
    description: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    unit_price: Joi.number().min(0).required(),
    tax_percent: Joi.number().min(0).optional(),
    total: Joi.number().optional()
  })).optional()
});

const updateInvoiceDto = Joi.object({
  customer_id: Joi.number().optional(),
  deal_id: Joi.number().allow(null).optional(),
  quotation_id: Joi.number().allow(null).optional(),
  total_amount: Joi.number().min(0).optional(),
  paid_amount: Joi.number().min(0).allow(null).optional(),
  due_amount: Joi.number().min(0).allow(null).optional(),
  status: Joi.string().valid('Pending', 'Partial', 'Paid').optional(),
  is_recurring: Joi.boolean().optional(),
  recurring_interval: Joi.string().valid('Monthly', 'Quarterly', 'Yearly').allow(null).optional(),
  items: Joi.array().items(Joi.object({
    id: Joi.number().optional(),
    description: Joi.string().optional(),
    quantity: Joi.number().min(1).optional(),
    unit_price: Joi.number().min(0).optional(),
    tax_percent: Joi.number().min(0).optional(),
    total: Joi.number().optional()
  })).optional()
});

export { createInvoiceDto, updateInvoiceDto };
