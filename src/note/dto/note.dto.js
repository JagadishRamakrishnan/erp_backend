import Joi from 'joi';

const createNoteDto = Joi.object({
  related_type: Joi.string().valid('Lead', 'Customer', 'Deal').required(),
  related_id: Joi.number().required(),
  note: Joi.string().required()
});

const updateNoteDto = Joi.object({
  related_type: Joi.string().valid('Lead', 'Customer', 'Deal').optional(),
  related_id: Joi.number().optional(),
  note: Joi.string().optional()
});

export { createNoteDto, updateNoteDto };
