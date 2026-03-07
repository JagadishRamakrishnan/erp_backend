import leadService from '../service/lead.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class LeadController {
  async create(req, res) {
    try {
      req.body.created_by = req.user.id;
      const lead = await leadService.createLead(req.body);
      return successResponse(res, lead, 'Lead created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const leads = await leadService.getAllLeads(req.query);
      return successResponse(res, leads);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const lead = await leadService.getLeadById(req.params.id);
      if (!lead) return errorResponse(res, 'Lead not found', 404);
      return successResponse(res, lead);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const lead = await leadService.updateLead(req.params.id, req.body);
      if (!lead) return errorResponse(res, 'Lead not found', 404);
      return successResponse(res, lead, 'Lead updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await leadService.deleteLead(req.params.id);
      if (!result) return errorResponse(res, 'Lead not found', 404);
      return successResponse(res, null, 'Lead deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async convertToCustomer(req, res) {
    try {
      const lead = await leadService.convertToCustomer(req.params.id);
      if (!lead) return errorResponse(res, 'Lead not found or already converted', 404);
      return successResponse(res, lead, 'Lead converted to customer successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new LeadController();
