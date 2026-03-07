import Activity from '../models/activity.model.js';
import User from '../../user/models/user.model.js';

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
