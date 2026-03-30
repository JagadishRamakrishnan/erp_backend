import LeadAssignmentRule from '../models/leadAssignmentRule.model.js';
import User from '../../user/models/user.model.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class LeadAssignmentRuleController {
  async getAll(req, res) {
    try {
      const rules = await LeadAssignmentRule.findAll({
        include: [{ model: User, as: 'assignee', attributes: ['name', 'email'] }],
        order: [['priority', 'DESC'], ['created_at', 'DESC']]
      });
      return successResponse(res, rules);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async create(req, res) {
    try {
      const rule = await LeadAssignmentRule.create(req.body);
      return successResponse(res, rule, 'Rule created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const rule = await LeadAssignmentRule.findByPk(req.params.id);
      if (!rule) return errorResponse(res, 'Rule not found', 404);
      await rule.update(req.body);
      return successResponse(res, rule, 'Rule updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const rule = await LeadAssignmentRule.findByPk(req.params.id);
      if (!rule) return errorResponse(res, 'Rule not found', 404);
      await rule.destroy();
      return successResponse(res, null, 'Rule deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new LeadAssignmentRuleController();
