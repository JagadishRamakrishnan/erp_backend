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

  async export(req, res) {
    try {
      const { type } = req.query;
      const csv = await reportsService.exportData(type);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_report.csv`);
      return res.send(csv);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new ReportsController();
