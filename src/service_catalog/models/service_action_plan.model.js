import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const ServiceActionPlan = db.sequelize.define('ServiceActionPlan', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  service_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'service_catalog',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  offset_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  priority: {
    type: DataTypes.STRING(50),
    defaultValue: 'Medium'
  },
  activity_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'Task'
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'service_action_plans',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default ServiceActionPlan;
