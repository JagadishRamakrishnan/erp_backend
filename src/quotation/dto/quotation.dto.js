import Joi from 'joi';

const quotationItemSchema = Joi.object({
  product_name: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  total: Joi.number().min(0).required()
});

const createQuotationDto = Joi.object({
  customer_id: Joi.number().required(),
  deal_id: Joi.number().allow(null).optional(),
  total_amount: Joi.number().min(0).required(),
  tax_amount: Joi.number().min(0).allow(null).optional(),
  status: Joi.string().valid('Draft', 'Sent', 'Approved', 'Rejected').optional(),
  items: Joi.array().items(quotationItemSchema).optional()
});

const updateQuotationDto = Joi.object({
  customer_id: Joi.number().optional(),
  deal_id: Joi.number().allow(null).optional(),
  total_amount: Joi.number().min(0).optional(),
  tax_amount: Joi.number().min(0).allow(null).optional(),
  status: Joi.string().valid('Draft', 'Sent', 'Approved', 'Rejected').optional()
});

export { createQuotationDto, updateQuotationDto };
