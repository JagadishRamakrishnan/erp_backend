import Task from '../models/task.model.js';
import User from '../../user/models/user.model.js';
import { Op } from 'sequelize';
class TaskService {
  async createTask(taskData) {
    return await Task.create(taskData);
  }

  async getAllTasks(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.assigned_to) where.assigned_to = filters.assigned_to;
    if (filters.priority) where.priority = filters.priority;

    return await Task.findAll({
      where,
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

// ✅ Fetch tasks by a specific due date (YYYY-MM-DD)
  async getTasksByDueDate(due_date) {
    const startOfDay = new Date(due_date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(due_date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Task.findAll({
      where: { due_date: { [Op.between]: [startOfDay, endOfDay] } },
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

  // ✅ Fetch tasks due today
  async getTodaysTasks() {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    return await Task.findAll({
      where: { due_date: { [Op.between]: [startOfDay, endOfDay] } },
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
  }


  async getTaskById(id) {
    return await Task.findByPk(id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

  async updateTask(id, taskData) {
    const task = await Task.findByPk(id);
    if (!task) return null;
    return await task.update(taskData);
  }

  async deleteTask(id) {
    const task = await Task.findByPk(id);
    if (!task) return null;
    await task.destroy();
    return true;
  }
}

export default new TaskService();
