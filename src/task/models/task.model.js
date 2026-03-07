import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Task = db.sequelize.define('Task', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  related_type: {
    type: DataTypes.ENUM('Lead', 'Customer', 'Deal'),
    allowNull: true
  },
  related_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  assigned_to: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Completed'),
    defaultValue: 'Pending'
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
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
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Task;
