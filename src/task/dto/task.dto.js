import Joi from 'joi';

const createTaskDto = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().allow('', null).optional(),
  related_type: Joi.string().valid('Lead', 'Customer', 'Deal').allow('', null).optional(),
  related_id: Joi.number().allow(null).optional(),
  assigned_to: Joi.number().allow(null).optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  status: Joi.string().valid('Pending', 'Completed').optional(),
  due_date: Joi.date().allow(null).optional()
});

const updateTaskDto = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().allow('', null).optional(),
  related_type: Joi.string().valid('Lead', 'Customer', 'Deal').allow('', null).optional(),
  related_id: Joi.number().allow(null).optional(),
  assigned_to: Joi.number().allow(null).optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  status: Joi.string().valid('Pending', 'Completed').optional(),
  due_date: Joi.date().allow(null).optional()
});

export { createTaskDto, updateTaskDto };
