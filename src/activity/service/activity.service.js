import Activity from '../models/activity.model.js';
import User from '../../user/models/user.model.js';
import { Op } from 'sequelize';
class ActivityService {
  async createActivity(activityData) {
    return await Activity.create(activityData);
  }

  async getAllActivities(filters = {}) {
    const where = {};
    if (filters.type) where.type = filters.type;
    if (filters.related_type) where.related_type = filters.related_type;
    if (filters.related_id) where.related_id = filters.related_id;

    return await Activity.findAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['activity_date', 'DESC']]
    });
  }

   // ✅ NEW: Get Today's Activities (Automatic)
async getTodayActivities() {
  const now = new Date();

  // IST offset in milliseconds
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  // Convert current time to IST
  const istNow = new Date(now.getTime() + IST_OFFSET);

  // Start of IST day
  const startOfDayIST = new Date(
    istNow.getFullYear(),
    istNow.getMonth(),
    istNow.getDate(),
    0, 0, 0, 0
  );

  // End of IST day
  const endOfDayIST = new Date(
    istNow.getFullYear(),
    istNow.getMonth(),
    istNow.getDate(),
    23, 59, 59, 999
  );

  // Convert IST → UTC for DB query
  const startUTC = new Date(startOfDayIST.getTime() - IST_OFFSET);
  const endUTC = new Date(endOfDayIST.getTime() - IST_OFFSET);

  return await Activity.findAll({
    where: {
      activity_date: {
        [Op.between]: [startUTC, endUTC]
      }
    },
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
    ],
    order: [['activity_date', 'DESC']]
  });
}

  async getActivityById(id) {
    return await Activity.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

  async updateActivity(id, activityData) {
    const activity = await Activity.findByPk(id);
    if (!activity) return null;
    return await activity.update(activityData);
  }

  async deleteActivity(id) {
    const activity = await Activity.findByPk(id);
    if (!activity) return null;
    await activity.destroy();
    return true;
  }
}

export default new ActivityService();
