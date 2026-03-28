import Joi from 'joi';

const createActivityDto = Joi.object({
  type: Joi.string().valid('Call', 'Email', 'Meeting', 'WhatsApp', 'Stage Change', 'Note', 'Task').required(),
  related_type: Joi.string().valid('Lead', 'Customer', 'Deal').allow('', null).optional(),
  related_id: Joi.number().allow(null).optional(),
  notes: Joi.string().allow('', null).optional(),
  activity_date: Joi.date().required(),
  scheduled_at: Joi.date().allow(null).optional(),
  created_by: Joi.number().optional()
});

const updateActivityDto = Joi.object({
  type: Joi.string().valid('Call', 'Email', 'Meeting', 'WhatsApp', 'Stage Change', 'Note', 'Task').optional(),
  related_type: Joi.string().valid('Lead', 'Customer', 'Deal').allow('', null).optional(),
  related_id: Joi.number().allow(null).optional(),
  notes: Joi.string().allow('', null).optional(),
  activity_date: Joi.date().optional(),
  scheduled_at: Joi.date().allow(null).optional(),
  created_by: Joi.number().optional()
});

export { createActivityDto, updateActivityDto };
