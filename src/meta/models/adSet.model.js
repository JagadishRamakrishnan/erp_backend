import { DataTypes } from 'sequelize';
import db from '../../db/index.js';

const AdSet = db.sequelize.define('AdSet', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  campaign_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'campaigns',
      key: 'id'
    }
  },
  adset_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  adset_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  budget: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'Paused'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'ad_sets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default AdSet;
