import { errorResponse } from '../../responseHelper.js';

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    
    next();
  };
};

export default validate;
