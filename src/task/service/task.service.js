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

async getTasksByDueDate(date) {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  let baseDate;

  if (date) {
    // If user passes date (YYYY-MM-DD), treat it as IST
    baseDate = new Date(date);
  } else {
    baseDate = new Date();
  }

  // Convert to IST
  const istDate = new Date(baseDate.getTime() + IST_OFFSET);

  // Start of IST day
  const startOfDayIST = new Date(
    istDate.getFullYear(),
    istDate.getMonth(),
    istDate.getDate(),
    0, 0, 0, 0
  );

  // End of IST day
  const endOfDayIST = new Date(
    istDate.getFullYear(),
    istDate.getMonth(),
    istDate.getDate(),
    23, 59, 59, 999
  );

  // Convert IST → UTC for DB
  const startUTC = new Date(startOfDayIST.getTime() - IST_OFFSET);
  const endUTC = new Date(endOfDayIST.getTime() - IST_OFFSET);

  return await Task.findAll({
    where: {
      due_date: {
        [Op.between]: [startUTC, endUTC],
      }
    },
    include: [
      { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
    ],
    order: [['due_date', 'ASC']]
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
