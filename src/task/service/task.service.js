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
async getTodayTasks(userId) {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const where = {
    due_date: {
      [Op.ne]: null,
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
    order: [['due_date', 'ASC']] // 🔥 nice UX improvement
  });
}
}

export default new TaskService();
