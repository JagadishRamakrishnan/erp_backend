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

  // ✅ Get tasks by due date
  async getTasksByDueDate(userId, due_date) {
    if (!due_date) throw new Error("due_date is required");

    // Start and end of the day in local timezone
    const startOfDay = new Date(due_date + 'T00:00:00');
    const endOfDay = new Date(due_date + 'T23:59:59.999');

    // Convert to UTC for database comparison
    const startUTC = new Date(startOfDay.getTime() - startOfDay.getTimezoneOffset() * 60000);
    const endUTC = new Date(endOfDay.getTime() - endOfDay.getTimezoneOffset() * 60000);

    const where = { due_date: { [Op.between]: [startUTC, endUTC] } };
    if (userId) where.assigned_to = userId;

    return await Task.findAll({
      where,
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['due_date', 'ASC']]
    });
  }
}

export default new TaskService();
