import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Activity = db.sequelize.define('Activity', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('Call', 'Email', 'Meeting', 'WhatsApp', 'Stage Change', 'Note', 'Task'),
    allowNull: false
  },
  related_type: {
    type: DataTypes.ENUM('Lead', 'Customer', 'Deal'),
    allowNull: true
  },
  related_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activity_date: {
    type: DataTypes.DATE,
    allowNull: false
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
  tableName: 'activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Activity;
