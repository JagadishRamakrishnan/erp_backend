import taskService from '../service/task.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class TaskController {
  async create(req, res) {
    try {
      req.body.created_by = req.user.id;
      const task = await taskService.createTask(req.body);
      return successResponse(res, task, 'Task created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const tasks = await taskService.getAllTasks(req.query);
      return successResponse(res, tasks);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      if (!task) return errorResponse(res, 'Task not found', 404);
      return successResponse(res, task);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      if (!task) return errorResponse(res, 'Task not found', 404);
      return successResponse(res, task, 'Task updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await taskService.deleteTask(req.params.id);
      if (!result) return errorResponse(res, 'Task not found', 404);
      return successResponse(res, null, 'Task deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

async getTodayTasks(req, res) {
  try {
    const userId = req.user?.id; // safer
    const tasks = await taskService.getTodayTasks(userId);

    return successResponse(res, tasks, "Today's tasks fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}
}

export default new TaskController();
