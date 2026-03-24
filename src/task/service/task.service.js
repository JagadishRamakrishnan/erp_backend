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

// ✅ Fetch tasks by due date (today or specific date)
async getTasksByDueDate(date) {
  // If no date is provided, use today's date automatically
  const targetDate = date ? new Date(date) : new Date();

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0); // 00:00:00

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999); // 23:59:59

  return await Task.findAll({
    where: {
      due_date: {
        [Op.between]: [startOfDay, endOfDay],
      }
    },
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
