import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const Campaign = db.sequelize.define('Campaign', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  ad_account_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'ad_accounts',
      key: 'id'
    }
  },
  campaign_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  campaign_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  objective: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'Paused', 'Deleted'),
    defaultValue: 'Active'
  },
  daily_budget: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'campaigns',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Campaign;
