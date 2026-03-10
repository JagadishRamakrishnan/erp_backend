import reportsService from '../service/reports.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class ReportsController {
  // Get Reports Data
  async getReports(req, res) {
    try {
      const reportsData = await reportsService.getReportsData();
      return successResponse(res, reportsData);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new ReportsController();
