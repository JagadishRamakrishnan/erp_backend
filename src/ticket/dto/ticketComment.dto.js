import Joi from 'joi';

const createTicketCommentDto = Joi.object({
  comment: Joi.string().required(),
  is_internal: Joi.boolean().optional()
});

export { createTicketCommentDto };
