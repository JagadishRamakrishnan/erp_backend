import Joi from 'joi';

const createPaymentDto = Joi.object({
  invoice_id: Joi.number().required(),
  amount: Joi.number().min(0).required(),
  payment_method: Joi.string().valid('Cash', 'UPI', 'Card', 'Bank').required(),
  payment_date: Joi.date().required(),
  reference_number: Joi.string().max(100).allow('', null).optional()
});

const updatePaymentDto = Joi.object({
  invoice_id: Joi.number().optional(),
  amount: Joi.number().min(0).optional(),
  payment_method: Joi.string().valid('Cash', 'UPI', 'Card', 'Bank').optional(),
  payment_date: Joi.date().optional(),
  reference_number: Joi.string().max(100).allow('', null).optional()
});

export { createPaymentDto, updatePaymentDto };
