import Joi from 'joi';

const createInvoiceDto = Joi.object({
  customer_id: Joi.number().required(),
  deal_id: Joi.number().allow(null).optional(),
  quotation_id: Joi.number().allow(null).optional(),
  total_amount: Joi.number().min(0).required(),
  paid_amount: Joi.number().min(0).allow(null).optional(),
  status: Joi.string().valid('Pending', 'Partial', 'Paid').optional()
});

const updateInvoiceDto = Joi.object({
  customer_id: Joi.number().optional(),
  deal_id: Joi.number().allow(null).optional(),
  quotation_id: Joi.number().allow(null).optional(),
  total_amount: Joi.number().min(0).optional(),
  paid_amount: Joi.number().min(0).allow(null).optional(),
  due_amount: Joi.number().min(0).allow(null).optional(),
  status: Joi.string().valid('Pending', 'Partial', 'Paid').optional()
});

export { createInvoiceDto, updateInvoiceDto };
