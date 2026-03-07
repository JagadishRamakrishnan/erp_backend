import Joi from 'joi';

const createTicketDto = Joi.object({
  customer_id: Joi.number().required(),
  subject: Joi.string().min(2).max(200).required(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('Open', 'In Progress', 'Closed').optional(),
  assigned_to: Joi.number().allow(null).optional()
});

const updateTicketDto = Joi.object({
  customer_id: Joi.number().optional(),
  subject: Joi.string().min(2).max(200).optional(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('Open', 'In Progress', 'Closed').optional(),
  assigned_to: Joi.number().allow(null).optional()
});

export { createTicketDto, updateTicketDto };
