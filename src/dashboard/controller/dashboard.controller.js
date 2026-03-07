import dashboardService from '../service/dashboard.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class DashboardController {
  async getDashboardStats(req, res) {
    try {
      const stats = await dashboardService.getDashboardStats(req.user.id);
      return successResponse(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new DashboardController();
