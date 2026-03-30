import AuditLog from '../../models/auditLog.model.js';
import User from '../../user/models/user.model.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class AuditLogController {
  async getAll(req, res) {
    try {
      const logs = await AuditLog.findAll({
        include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
        order: [['created_at', 'DESC']],
        limit: 200
      });
      return successResponse(res, logs);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new AuditLogController();
