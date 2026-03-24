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

    // ✅ Get today's tasks
async getTasksByDueDate(userId, due_date) {
  // Convert string to Date objects for start/end of that day
  const startOfDay = new Date(due_date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(due_date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const where = {
    due_date: {
      [Op.between]: [startOfDay, endOfDay]
    }
  };

  if (userId) {
    where.assigned_to = userId;
  }

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
