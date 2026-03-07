import dealService from '../service/deal.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class DealController {
  async create(req, res) {
    try {
      const deal = await dealService.createDeal(req.body);
      return successResponse(res, deal, 'Deal created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const deals = await dealService.getAllDeals(req.query);
      return successResponse(res, deals);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const deal = await dealService.getDealById(req.params.id);
      if (!deal) return errorResponse(res, 'Deal not found', 404);
      return successResponse(res, deal);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const deal = await dealService.updateDeal(req.params.id, req.body);
      if (!deal) return errorResponse(res, 'Deal not found', 404);
      return successResponse(res, deal, 'Deal updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await dealService.deleteDeal(req.params.id);
      if (!result) return errorResponse(res, 'Deal not found', 404);
      return successResponse(res, null, 'Deal deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new DealController();
