import activityService from '../service/activity.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class ActivityController {
  async create(req, res) {
    try {
      req.body.created_by = req.user.id;
      const activity = await activityService.createActivity(req.body);
      return successResponse(res, activity, 'Activity created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const activities = await activityService.getAllActivities(req.query);
      return successResponse(res, activities);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getToday(req, res) {
  try {
    const activities = await activityService.getTodayActivities();
    return successResponse(res, activities);
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

  async getById(req, res) {
    try {
      const activity = await activityService.getActivityById(req.params.id);
      if (!activity) return errorResponse(res, 'Activity not found', 404);
      return successResponse(res, activity);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const activity = await activityService.updateActivity(req.params.id, req.body);
      if (!activity) return errorResponse(res, 'Activity not found', 404);
      return successResponse(res, activity, 'Activity updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await activityService.deleteActivity(req.params.id);
      if (!result) return errorResponse(res, 'Activity not found', 404);
      return successResponse(res, null, 'Activity deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new ActivityController();
