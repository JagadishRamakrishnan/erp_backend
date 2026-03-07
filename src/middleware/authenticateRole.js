import { errorResponse } from '../../responseHelper.js';

const authenticateRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Insufficient permissions', 403);
    }
    next();
  };
};

export default authenticateRole;
